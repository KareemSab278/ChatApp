import '../styles/HomePage.css';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { getChats, getUsers, createChat } from "../../app";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();
  const user = location.state?.signedInUser;
  const [searchChat, setSearchChat] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    }
    fetchUsers();
    fetchChats();
  }, [user]);

  const fetchChats = async () => {
    let chats = await getChats();
    setChats(chats);
};

console.log(users)

  const handleChatSelect = (chats) => {
    setSelectedChat(chats);
    navigate(`/Chats/${chats?.id}`, { state: { signedInUser:user } }); // added the state because it wasnt persisting accross pages

    console.log("Navigating with user:", user);

if (!user) {
  console.error("User is undefined! Check where it's set.");
  navigate('/'); //goes back to sign in page if there is no user
}
  };

  const handleUserSelect = async (selectedUser) => {
    const existingChat = chats.find(
      (chat) =>
        chat.participants.length === 2 &&
        chat.participants.includes(user._id) &&
        chat.participants.includes(selectedUser._id)
    );
  
    if (existingChat) {
      navigate(`/Chats/${existingChat._id}`, { state: { signedInUser: user } });
    } else {
      try {
        const newChat = await createChat([user._id, selectedUser._id]);
        if (newChat) {
          setChats((prevChats) => [...prevChats, newChat]);
          await fetchChats();
          navigate(`/Chats/${newChat._id}`, { state: { signedInUser: user } });
        } else {
          console.error("Failed to create chat");
        }
      } catch (error) {
        console.error("Error creating new chat:", error.message);
      }
    }
  };
  

const signOut =  ()=>{
  localStorage.removeItem("signedInUser");
  navigate(`/`, { replace: true });
  navigate(`/`, { state: { signedInUser:null } })
}

  const filteredUsers = users.filter((users) =>
    (String(searchUser || "").trim() === "" ? true : (users.username && users.username.toLowerCase().includes(String(searchUser).toLowerCase())) )
  );
  
  const filteredChats = chats.filter((chats) =>
    (String(searchChat || "") === "" ? true : (chats._id && chats._id.toLowerCase().includes(String(searchChat).toLowerCase())) )
  );

    const getChatDisplayName = (chat) => {
      const otherParticipants = chat.participants.filter((id) => id !== user._id); // changed this to show any participants in chat EXCEPT the signed in user
      const usernames = otherParticipants.map((id) => {
        const participant = users.find((u) => u._id === id);
        return participant ? participant.username : id;
      });
      return usernames.join(", ");
    };


  return (
    <div className="homepage-container">
    <Button
    name= {'sign out'}
    onClick={() => signOut()}>
    </Button>
    {/* <input
        type="text"
        placeholder="Search chats..."
        className="search-input"
        autoComplete="off"
        value={searchChat}
        onChange={(e) => setSearchChat(e.target.value)}
      /> */}

      <input
        type="text"
        placeholder="Search users..."
        className="search-input"
        autoComplete="off"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
      />


      <div className="chat-list">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <Link key={chat._id} to={`/Chats/${chat._id}`} className="chat-link">
              <Button
  name={getChatDisplayName(chat)}
  onClick={() => handleChatSelect(chat)}
  className={`chat-button ${
    selectedChat?._id === chat._id ? "chat-button-selected" : "chat-button-default"
  } ${chat.type === "group" ? "chat-button-group" : ""}`}
/>
            </Link>
          ))
        ) : (
          <div className="no-chats-message">No chats found matching your search</div>
        )}
      </div>

      {searchUser && (
        <div className="user-list">
          <h3>Users</h3>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Button
                key={user._id}
                name={user.username}
                onClick={() => handleUserSelect(user)}
                className="user-button"
              />
            ))
          ) : (
            <div className="no-users-message">No users found matching your search</div>
          )}
        </div>
      )}
      
      <p style={{ fontSize: "10px" }}>{user?.username}</p>
    </div>
  );
};

export default HomePage;