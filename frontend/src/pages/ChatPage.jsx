import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { chats } from "./HomePage";

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const chat = chats.find((chat) => chat.id === parseInt(chatId));
  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState(chat ? [...chat.messages] : []);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!chat) {
      navigate("/");
    } else {
      setMessages([...chat.messages]);
    }
  }, [chat, navigate]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      text: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    
    if (chat) {
      chat.messages.push(newMessage);
    }

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
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </button>
            <h2 className="text-xl">
              {chat.name} ({chat.type})
            </h2>
          </div>
          <span className="text-gray-400 text-sm">
            {chat.type === "dm" ? "Direct Message" : "Group Chat"}
          </span>
        </div>
      </div>

      <ChatBox ref={chatBoxRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 ${
              msg.sender === "You" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.sender === "You" ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              <div className="text-sm text-gray-400">{msg.sender}</div>
              <div>{msg.text}</div>
              <div className="text-xs text-gray-500 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </ChatBox>

      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;