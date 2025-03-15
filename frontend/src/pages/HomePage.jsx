import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

export const chats = [
  {
    id: 1,
    name: "user 1",
    type: "dm",
    messages: [
      { id: 1, sender: "user 1", text: "Hey, how's it going?", timestamp: new Date() },
      { id: 2, sender: "You", text: "Good, thanks! How about you?", timestamp: new Date() },
    ],
  },
  {
    id: 2,
    name: "user 2",
    type: "dm",
    messages: [
      { id: 1, sender: "user 2", text: "Got any plans this weekend?", timestamp: new Date() },
    ],
  },
  {
    id: 3,
    name: "user 3",
    type: "dm",
    messages: [
      { id: 1, sender: "user 3", text: "Can you help me with something?", timestamp: new Date() },
    ],
  },
  {
    id: 4,
    name: "user 4",
    type: "dm",
    messages: [
      { id: 1, sender: "user 4", text: "Check out this link!", timestamp: new Date() },
    ],
  },
  {
    id: 5,
    name: "Study Group",
    type: "group",
    messages: [
      { id: 1, sender: "user 1", text: "Anyone done the assignment?", timestamp: new Date() },
      { id: 2, sender: "user 2", text: "Working on it now", timestamp: new Date() },
      { id: 3, sender: "user 3", text: "I need help with question 3", timestamp: new Date() },
    ],
  },
];

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    console.log(`Selected chat: ${chat.name} (${chat.type})`);
    navigate(`/Chats/${chat.id}`);
  };

  const filteredChats = chats.filter((chat) => {
    return search.toLowerCase() === ""
      ? chat
      : chat.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-gray-900 text-white h-screen p-4">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <Link
              key={chat.id}
              to={`/Chats/${chat.id}`}
              className="block"
            >
              <Button
                name={`${chat.name}`}
                onClick={() => handleChatSelect(chat)}
                className={`w-full text-left p-3 rounded transition-colors ${
                  selectedChat?.id === chat.id
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-800 hover:bg-gray-700"
                } ${chat.type === "group" ? "border-l-4 border-green-500" : ""}`}
              />
            </Link>
          ))
        ) : (
          <div className="text-gray-400 text-center p-4">
            No chats found matching your search
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;