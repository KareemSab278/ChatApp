export async function getChats() {
  try {
    const chats = await fetch("https://chatapp-4fjb.onrender.com/chats");
    if (!chats.ok) throw new Error("Failed to fetch Chats");

    return await chats.json();
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export async function getMessages() {
  try {
    const messages = await fetch("https://chatapp-4fjb.onrender.com/messages");
    if (!messages.ok) throw new Error("Failed to fetch messages");

    return await messages.json();
  } catch (e) {
    console.error(e.message);
    return [];
  }
};

export async function getUsers() {
    try {
      const users = await fetch("https://chatapp-4fjb.onrender.com/users");
      if (!users.ok) throw new Error("Failed to fetch users");
  
      return await users.json();
    } catch (e) {
      console.error(e.message);
      return [];
    }
  };

export async function messagesByChatId(id) {
try {
    const messagesByChatId = await fetch(`https://chatapp-4fjb.onrender.com/messages/${id}`);
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
    const response = await fetch('https://chatapp-4fjb.onrender.com/new-mssg', {
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

export async function createChat(participants) { // fixed this up to create a new chat
  try {
    const response = await fetch('https://chatapp-4fjb.onrender.com/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participants,
      }),
    });

    if (!response.ok){
      const errorData = await response.json();
  throw new Error(errorData.message || "Failed to create chat");
    }
    return await response.json();

  } catch (e) {
    console.error("Error creating chat:", e.message);
    return null;
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
    senderId: "You", // if i change this the thing crashes idk why. dont touch it.
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

// this wasnt working because i wasnt comparing bcrypt password but just plain text lol. im an idioto

export async function signInUser(credentials) {
  try {
    const response = await fetch('https://chatapp-4fjb.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data;
  } catch (error) {
    console.error('signInUser error:', error);
    throw error;
  }
}

export async function signUpUser(credentials) {
  try {
    const response = await fetch("https://chatapp-4fjb.onrender.com/new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data;
  } catch (error) {
    console.error("signUpUser error:", error);
    throw error;
  }
}

const handleSignUp = async (e) => {
  e.preventDefault();

  if (!username || !f_name || !password) {
    console.error("All fields are required");
    return;
  }

  const newUser = {
    id: username,
    username,
    f_name,
    password,
  };

  try {
    const response = await signUpUser(newUser);
    console.log("User signed up successfully:", response);
  } catch (error) {
    console.error("Signup failed:", error.message);
  }
};


export default {getMessages, getChats, getUsers, messagesByChatId, sendNewMessage, signInUser, createChat, signUpUser}