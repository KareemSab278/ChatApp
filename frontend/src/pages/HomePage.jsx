import '../styles/HomePage.css';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { getChats, getUsers } from "../../app";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();
  const user = location.state?.signedInUser;
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getChats();
      setChats(chats);
    };

    fetchChats();
  }, []);

  const handleChatSelect = (chats) => {
    setSelectedChat(chats);
    navigate(`/Chats/${chats.id}`);
  };

  const filteredChats = chats.filter((chats) =>
    (String(search || "") === "" ? true : (chats._id && chats._id.toLowerCase().includes(String(search).toLowerCase())) )
  );

  return (
    <div className="homepage-container">
      <input
        type="text"
        placeholder="Search users..."
        className="search-input"
        autoComplete="off"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="chat-list">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <Link key={chat._id} to={`/Chats/${chat._id}`} className="chat-link">
              <Button
                name={chat.participants[1]} // need to change this for groups in the future it only shows the second user in the chat
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
      <p style={{ fontSize: "10px" }}>{user?.username}</p>
    </div>
  );
};

export default HomePage;