import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { messagesByChatId, sendNewMessage, getChats } from "../../app"; // added sendNewMessage
import '../styles/ChatPage.css'
import { useLocation } from "react-router-dom";

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
      const chats = await getChats();
      const selectedChat = chats.find(chat => chat._id === chatId);
        const participants = selectedChat.participants;
        console.log(participants)
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
    <div className="chat-container">
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <button
              onClick={() => backButton()}
              className="back-button"
            >
              ← Back
            </button>
            <h2 className="chat-title">{participants.slice(1)}</h2>
          </div>
          {/* <span className="dm-label">DM</span> */}
        </div>
      </div>

      <ChatBox ref={chatBoxRef} className="chat-box"> {/* error here somewhere?????? */}
        {messages.map((msg) => (
          <div
            key={msg._id}
            // className={`message ${msg.sender === "You" ? "message-right" : "message-left"}`}
            className={`message ${msg.senderId === user.username ? "message-right" : "message-left"}`}
          >
            <div
              className={`message-bubble ${msg.senderId === user.username ? "message-you" : "message-other"}`}
            >
              <div className="sender">{msg.senderId}</div> {/* updated sender to senderId to show the sender inf rontend */}
              <div>{msg.content}</div>
              <div className="timestamp">
                 {msg.timestamp.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </ChatBox>

      <div className="input-container">
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="message-input"
          />
          <button
            type="submit"
            className="send-button"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;