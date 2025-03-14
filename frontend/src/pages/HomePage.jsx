import { useState } from "react";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const chats = [
    { id: 1, name: "John Doe", type: "dm" },
    { id: 2, name: "Study Group", type: "group" }
  ];

  return (
    <div className="bg-gray-900 text-white h-screen p-4">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        {chats.map((chat) => (
          <div key={chat.id} className="p-3 mb-2 bg-gray-800 rounded cursor-pointer">
            {chat.name} ({chat.type})
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
