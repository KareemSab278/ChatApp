export async function getChats() {
  try {
    const chats = await fetch("http://localhost:3307/chats");
    if (!chats.ok) throw new Error("Failed to fetch Chats");

    return await chats.json();
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export async function getMessages() {
  try {
    const messages = await fetch("http://localhost:3307/messages");
    if (!messages.ok) throw new Error("Failed to fetch messages");

    return await messages.json();
  } catch (e) {
    console.error(e.message);
    return [];
  }
};

export async function getUsers() {
    try {
      const users = await fetch("http://localhost:3307/users");
      if (!users.ok) throw new Error("Failed to fetch users");
  
      return await users.json();
    } catch (e) {
      console.error(e.message);
      return [];
    }
  };

export async function messagesByChatId(id) {
try {
    const messagesByChatId = await fetch(`http://localhost:3307/messages/${id}`);
    if (!messagesByChatId.ok) throw new Error("Failed to fetch users");
    return await messagesByChatId.json();
} catch (e) {
    console.error(e.message);
    return [];
}
};

export default {getMessages, getChats, getUsers, messagesByChatId}