import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { messagesByChatId, sendNewMessage, getChats } from "../../app";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const ChatPage = () => {
  const location = useLocation();
  const userFromState = location.state?.signedInUser;
  const user = userFromState || JSON.parse(localStorage.getItem("signedInUser"));  const { chatId } = useParams();
  // so the issue was with keeping the user signed in. i tried avoiding using localstorage but had no other solution i could think up.
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchChat = async () => {
      const chatData = await messagesByChatId(chatId);
      if (chatData && chatData.length >= 0) { // added the = because the page wasnt loading on empty convos lmao
        setChat({ _id: chatId });
        const normalizedMessages = chatData.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(normalizedMessages);
      } 
    };

    const fetchParticipants = async () => {
      if (!user || !user._id) return;
      const chats = await getChats(user._id);
      const selectedChat = chats.find(chat => chat._id === chatId);
      if (!selectedChat || !selectedChat.participants.includes(user._id)) {
        // User is not a participant, redirect or show error
        navigate('/chats', { state: { signedInUser: user } });
        return;
      }
      setParticipants(selectedChat.participants);
    };
    
    fetchParticipants();
    fetchChat();
  }, [chatId, navigate]);

  
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    if(!user){
      navigate('/'); //goes back to sign in page if there is no user
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
  
    // console.log("chatId from useParams:", chatId);
    if (!chatId) {
      console.error("chatId is undefined - cannot send message"); // had to use ai here to pinpoint the problem and for error handling
      return;
    }

    const newMessage = {
      chatId: chatId,
      // senderId: "You", // Changed to senderId
      sender: user._id,
      senderId: user.username,          //getting an issue here where sender and sender id is always undefined???? - solved
      content: message,
      timestamp: new Date(),
    };

    sendNewMessage(newMessage)
      .then((savedMessage) => {
        if (savedMessage && savedMessage._id) {
          setMessages((prevMessages) => [...prevMessages, savedMessage]);
        } else {
          console.error("Server didn’t return a valid message:", savedMessage);
        }
      })
      .catch((err) => console.error("Failed to send message:", err.message));
    setMessage("");
  };

  const backButton = ()=>{
    navigate(`/chats`, { state: { signedInUser:user } })
    console.log('navigating with user', user)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  if (!chat) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#181a20', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', height: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative', boxShadow: 3, borderRadius: 3, bgcolor: 'transparent' }}>
        {/* Header - fixed at the top of the chat box */}
        <Paper elevation={2} sx={{
          width: '100%',
          borderRadius: '12px 12px 0 0',
          p: 2,
          bgcolor: '#23263a',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <IconButton onClick={backButton} size="large" sx={{ mr: 2, color: '#fff' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            {participants.slice(1).join(', ') || 'Chat'}
          </Typography>
        </Paper>

        {/* Chat messages - scrollable */}
        <Box sx={{
          flex: 1,
          width: '100%',
          p: 2,
          overflowY: 'auto',
          bgcolor: '#181a20',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderLeft: '1px solid #23263a',
          borderRight: '1px solid #23263a',
          maxHeight: 'calc(90vh - 128px)', // header + input height
          minHeight: '0',
        }} ref={chatBoxRef}>
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

        {/* Input - fixed at the bottom of the chat box */}
        <Paper elevation={3} sx={{
          width: '100%',
          borderRadius: '0 0 12px 12px',
          p: 2,
          bgcolor: '#23263a',
          borderTop: '1px solid #23263a',
          position: 'sticky',
          bottom: 0,
          zIndex: 10
        }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              sx={{ bgcolor: '#181a20', input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' }, '&:hover fieldset': { borderColor: '#6a82fb' }, '&.Mui-focused fieldset': { borderColor: '#6a82fb' } } }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 1, px: 3, borderRadius: 2, bgcolor: '#6a82fb', color: '#fff', '&:hover': { bgcolor: '#5a6fdc' } }}>
              Send
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatPage;