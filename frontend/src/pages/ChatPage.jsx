import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { messagesByChatId, sendNewMessage } from "../../app"; // added sendNewMessage
import '../styles/ChatPage.css'

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);

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
  
    fetchChat();
  }, [chatId, navigate]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
  
    console.log("chatId from useParams:", chatId);
    if (!chatId) {
      console.error("chatId is undefined - cannot send message"); // had to use ai here to pinpoint the problem and for error handling
      return;
    }
  
    const newMessage = {
      chatId: chatId,
      senderId: "You", // Changed to senderId
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
              onClick={() => navigate("/")}
              className="back-button"
            >
              ← Back
            </button>
            <h2 className="chat-title">{chatId}</h2>
          </div>
          <span className="dm-label">DM</span>
        </div>
      </div>

      <ChatBox ref={chatBoxRef} className="chat-box"> {/* error here somewhere?????? */}
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.sender === "You" ? "message-right" : "message-left"}`}
          >
            <div
              className={`message-bubble ${msg.sender === "You" ? "message-you" : "message-other"}`}
            >
              <div className="sender">{msg.senderId}</div> {/* updated sender to senderId to show the sender inf rontend */}
              <div>{msg.content}</div>
              <div className="timestamp">
                 {msg.timestamp.toString()} {/* got an issue with converting to local time string which crashes the page apparently when sending a message... */}
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