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

// am now working on sending messages

export async function sendNewMessage(params) {
  try {
    const response = await fetch('http://localhost:3307/new-mssg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });

    const data = await response.json();
    return data;

  } catch (e) {
    console.error(e.message);
  }
}

const handleSendMessage = (e) => {
  e.preventDefault();
  if (message.trim() === "") return;
  if (!chatId) {
    console.error("chatId is undefined - cannot send message");
    return;
  }

  const newMessage = {
    chatId: chatId,
    senderId: "You", // Changed to senderId to match schema in mongodb
    content: message,
    timestamp: new Date(),
  };

  sendNewMessage(newMessage)
    .then((savedMessage) => {
      if (savedMessage && savedMessage._id) {
        console.log("Message saved successfully:", savedMessage);
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, _id: savedMessage._id }]);
      } else {
        console.error("Server didn’t return a valid message:", savedMessage);
      }
    })
    .catch((err) => console.error("Failed to send message:", err.message));
  setMessage("");
};


export async function signInUser(id, password){
  try{

  }
  catch(e){
    console.error(e.message)
  }
}

export default {getMessages, getChats, getUsers, messagesByChatId, sendNewMessage, signInUser}