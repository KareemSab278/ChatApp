import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getChats, getUsers, createChat, messagesByChatId, sendNewMessage } from "../../app";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import {
  mainBoxStyle,
  drawerPaperStyle,
  sidebarBoxStyle,
  signOutButtonStyle,
  searchTextFieldStyle,
  chatButtonStyle,
  chatAreaBoxStyle,
  chatMessagesBoxStyle,
  chatInputPaperStyle
} from '../styles/homePageStyles';

const HomePage = () => {
  const location = useLocation();
  const user = location.state?.signedInUser;
  const [searchUser, setSearchUser] = useState("");
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
    fetchUsers();
    fetchChats();
  }, [user]);

  const fetchChats = async () => {
    if (!user || !user._id || !user.username) return;
    let chats = await getChats(user._id);
    setChats(chats);
  };

  const fetchMessages = async (chatId) => {
    const chatData = await messagesByChatId(chatId);
    if (chatData && chatData.length >= 0) {
      const normalizedMessages = chatData.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(normalizedMessages);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
    setDrawerOpen(false); // close drawer on mobile
  };

  const handleUserSelect = async (selectedUser) => {
    const existingChat = chats.find(
      (chat) =>
        chat.participants.includes(user._id) &&
        chat.participants.length === 2 &&
        chat.participants.includes(selectedUser._id)
    );
    if (existingChat) {
      setSelectedChat(existingChat);
      fetchMessages(existingChat._id);
      setDrawerOpen(false);
    } else {
      try {
        const newChat = await createChat([user._id, selectedUser._id]);
        if (newChat) {
          setChats((prevChats) => [...prevChats, newChat]);
          await fetchChats();
          setSelectedChat(newChat);
          fetchMessages(newChat._id);
          setDrawerOpen(false);
        } else {
          console.error("Failed to create chat");
        }
      } catch (error) {
        console.error("Error creating new chat:", error.message);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "" || !selectedChat) return;
    const newMessage = {
      chatId: selectedChat._id,
      sender: user._id,
      senderId: user.username,
      content: message,
      timestamp: new Date(),
    };
    sendNewMessage(newMessage)
      .then(async (savedMessage) => {
        if (savedMessage && savedMessage._id) {
          // Instead of appending, fetch latest messages from server for consistency
          await fetchMessages(selectedChat._id);
        } else {
          console.error("Server didn’t return a valid message:", savedMessage);
        }
      })
      .catch((err) => console.error("Failed to send message:", err.message));
    setMessage("");
  };
  // Poll for new messages in the selected chat every 2 seconds
  useEffect(() => {
    if (!selectedChat) return;
    const interval = setInterval(() => {
      fetchMessages(selectedChat._id);
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedChat]);
  

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const signOut = () => {
    localStorage.removeItem("signedInUser");
    navigate(`/`, { replace: true });
    navigate(`/`, { state: { signedInUser: null } });
  };

  const filteredUsers = users.filter((u) =>
    (String(searchUser || "").trim() === "" ? true : (u.username && u.username.toLowerCase().includes(String(searchUser).toLowerCase())))
  );

  const filteredChats = chats.filter((chat) =>
    chat.participants && chat.participants.includes(user._id)
  );

  const getChatDisplayName = (chat) => {
    const otherParticipants = chat.participants.filter((id) => id !== user._id);
    const usernames = otherParticipants.map((id) => {
      const participant = users.find((u) => u._id === id);
      return participant ? participant.username : id;
    });
    return usernames.join(", ");
  };

  return (
    <Box sx={mainBoxStyle}>
      {/* Sidebar for desktop, Drawer for mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': drawerPaperStyle }}
      >
        {/* Sidebar content for Drawer */}
        <Box sx={sidebarBoxStyle}>
          <Button variant="contained" color="secondary" onClick={signOut} sx={signOutButtonStyle}>Sign Out</Button>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users..."
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
            size="small"
            sx={searchTextFieldStyle}
          />
          <Typography variant="subtitle2" sx={{ color: '#bdbdbd', mb: 1 }}>Chats</Typography>
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <Button
                  key={chat._id}
                  variant={selectedChat?._id === chat._id ? "contained" : "outlined"}
                  color={selectedChat?._id === chat._id ? "primary" : "inherit"}
                  onClick={() => handleChatSelect(chat)}
                  sx={chatButtonStyle(selectedChat?._id === chat._id)}
                >
                  {getChatDisplayName(chat) || 'Group Chat'}
                </Button>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#bdbdbd', textAlign: 'center', mt: 2 }}>No chats found</Typography>
            )}
          </Box>
          {searchUser && (
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#bdbdbd', mb: 1 }}>Users</Typography>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <Button
                    key={u._id}
                    variant="outlined"
                    color="inherit"
                    onClick={() => handleUserSelect(u)}
                    sx={chatButtonStyle(false)}
                  >
                    {u.username}
                  </Button>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#bdbdbd', textAlign: 'center', mt: 2 }}>No users found</Typography>
              )}
            </Box>
          )}
          <Typography variant="caption" sx={{ color: '#bdbdbd', mt: 2 }}>{user?.username}</Typography>
        </Box>
      </Drawer>

      {/* Sidebar for desktop */}
      <Box
        sx={{
          width: { xs: 0, sm: 300 },
          bgcolor: '#23263a',
          p: { xs: 0, sm: 2 },
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          borderRight: { xs: 'none', sm: '1px solid #23263a' },
        }}
      >
        <Button variant="contained" color="secondary" onClick={signOut} sx={signOutButtonStyle}>Sign Out</Button>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          size="small"
          sx={searchTextFieldStyle}
        />
        <Typography variant="subtitle2" sx={{ color: '#bdbdbd', mb: 1 }}>Chats</Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <Button
                key={chat._id}
                variant={selectedChat?._id === chat._id ? "contained" : "outlined"}
                color={selectedChat?._id === chat._id ? "primary" : "inherit"}
                onClick={() => handleChatSelect(chat)}
                sx={chatButtonStyle(selectedChat?._id === chat._id)}
              >
                {getChatDisplayName(chat) || 'Group Chat'}
              </Button>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#bdbdbd', textAlign: 'center', mt: 2 }}>No chats found</Typography>
          )}
        </Box>
        {searchUser && (
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#bdbdbd', mb: 1 }}>Users</Typography>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <Button
                  key={u._id}
                  variant="outlined"
                  color="inherit"
                  onClick={() => handleUserSelect(u)}
                  sx={chatButtonStyle(false)}
                >
                  {u.username}
                </Button>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#bdbdbd', textAlign: 'center', mt: 2 }}>No users found</Typography>
            )}
          </Box>
        )}
        <Typography variant="caption" sx={{ color: '#bdbdbd', mt: 2 }}>{user?.username}</Typography>
      </Box>

      {/* Chat area */}
      <Box sx={chatAreaBoxStyle}>
        {/* mobile menu button */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', p: 1, bgcolor: '#23263a', borderBottom: '1px solid #23263a' }}>
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', ml: 1 }}>
            {selectedChat ? getChatDisplayName(selectedChat) : 'Chat'}
          </Typography>
        </Box>
        {selectedChat ? (
          <>
            {/* header for desktop */}
            <Paper elevation={2} sx={{
              width: '100%',
              borderRadius: '0 0 0 0',
              p: 2,
              bgcolor: '#23263a',
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              flexShrink: 0,
              position: 'sticky',
              top: 0,
              zIndex: 2,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                {getChatDisplayName(selectedChat) || 'Chat'}
              </Typography>
            </Paper>
            {/* Messages */}
            <Box sx={chatMessagesBoxStyle} ref={chatBoxRef}>
              {messages.map((msg) => (
                <Stack key={msg._id} direction="row" justifyContent={msg.senderId === user.username ? 'flex-end' : 'flex-start'}>
                  <Paper elevation={1} sx={{
                    bgcolor: msg.senderId === user.username ? '#3a3f5a' : '#23263a',
                    color: '#fff',
                    px: 2, py: 1, borderRadius: 2, maxWidth: '80%', minWidth: 60,
                    boxShadow: msg.senderId === user.username ? '0 2px 8px #6a82fb33' : '0 2px 8px #0002'
                  }}>
                    <Typography variant="caption" color="#bdbdbd" sx={{ fontWeight: 500 }}>
                      {msg.senderId}
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-word', color: '#fff' }}>{msg.content}</Typography>
                    <Typography variant="caption" color="#bdbdbd" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                      {msg.timestamp && new Date(msg.timestamp).toLocaleString()}
                    </Typography>
                  </Paper>
                </Stack>
              ))}
            </Box>
            {/* Input */}
            <Paper elevation={3} sx={chatInputPaperStyle}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  size="small"
                  sx={{ bgcolor: '#181a20', input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' }, '&:hover fieldset': { borderColor: '#6a82fb' }, '&.Mui-focused fieldset': { borderColor: '#6a82fb' } } }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ ml: 1, px: 3, borderRadius: 2, bgcolor: '#6a82fb', color: '#fff', '&:hover': { bgcolor: '#5a6fdc' } }}>
                  Send
                </Button>
              </form>
            </Paper>
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#181a20' }}>
            <Typography variant="h5" sx={{ color: '#bdbdbd' }}>
              Select a user to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;