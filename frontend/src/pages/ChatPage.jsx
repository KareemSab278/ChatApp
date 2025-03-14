import { useState } from "react";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "John Doe", text: "Lorem ipsum dolor sit amet. Id architecto dolorem non inventore aperiam sit ipsam quos! Id debitis perspiciatis ut veniam minus sed veritatis beatae ab tempora dicta. 33 provident distinctio quo repellendus temporibus in recusandae nihil ut debitis repellat hic excepturi voluptatem. Ut exercitationem autem et voluptates doloremque est dolor porro." }
  ]);
  const [message, setMessage] = useState("");

  return (
    <>
    <div>
      <div>Chat Name</div>
      <div>
        <ChatBox>
        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.sender}</b> <br></br> {msg.text}
          </div>
        ))}
        </ChatBox>
      </div>
      <div>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </div>
    </div>
    </>
  );
};

export default ChatPage;