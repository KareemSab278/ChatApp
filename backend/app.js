const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//====================================================================================

mongoose.connect('mongodb+srv://KareemSab278:Assbook%4027@cluster.oa33q.mongodb.net/chat', { // changed the url
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

//====================================================================================

const userSchema = new mongoose.Schema({
    _id: { type: String },
    username: { type: String, required: true, unique: true },
    f_name: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    // _id: String,
    participants: { type: Array },
    createdAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date, default: Date.now }
});

const mssgSchema = new mongoose.Schema({ // removed _id from here because it is an auto inc ion mongo db
    chatId: String,
    senderId: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('chats', chatSchema);
const Message = mongoose.model('messages', mssgSchema);

//==================================================================================== ENDPOINTS

//=============================================================== GET

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
        // console.log(users.map(user => user._id.toString()));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/chats', async (req, res) => {
    try {
        const chats = await Chat.find({});
        res.status(200).json(chats);
        // console.log(chats.map(chat => chat._id.toString()));
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

app.get('/chats/:participant', async (req, res) => {
    try {
        const { participant } = req.params;
        const chats = await Chat.find({ participants: { $in: [participant] } }); // might be this thats the security problem.
        if (!chats.length) {
            console.log('chat doesn’t exist');
            return res.status(404).json({ message: 'No chats found' });
        }
        res.status(200).json(chats);
        // console.log(chats.map(chat => chat._id.toString()));
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find({});
        res.status(200).json(messages);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

app.get(`/messages/:_id`, async (req, res) => {
    try {
        const { _id } = req.params;
        const messages = await Message.find({ chatId: _id });
        res.status(200).json(messages);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

//=============================================================== CREATE

app.post(`/new-user`, async (req, res) => {
    try {
        const { id, username, f_name, password } = req.body;
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        if (!f_name) {
            return res.status(400).json({ message: "First name (f_name) is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        // if (!id) {
        //     return res.status(400).json({ message: "User ID (_id) is required" }); removed this cringe ahh code
        // }

        const account = {
            _id: username, // i set it up to be the username because searching users by username was a pain in the ass on the homepage
            username: username,
            f_name: f_name,
            password: await bcrypt.hash(password, 10),
            createdAt: Date.now()
        };
        await new User(account).save();
        res.status(200).json({ message: "User created successfully" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

app.post('/new-mssg', async (req, res) => {
    console.log("Received POST /new-mssg:", req.body);
    try {
      const { mssgId, chatId, sender, senderId, content } = req.body;
      console.log("Parsed fields:", { mssgId, chatId, sender, senderId, content }); // fix: removed id because mongo can handle it for me anyway
  
      if (!chatId || (!sender && !senderId) || !content) {
        console.log("Validation failed: Missing required fields");
        return res.status(400).json({ message: "chatId, sender/senderId, and content are required" });
      }
  
      const message = {
        chatId: chatId,
        senderId: senderId || sender,
        content: content,
        timestamp: Date.now(),
        isRead: false,
      };
      const savedMessage = await new Message(message).save();
      console.log("Message saved:", savedMessage);
      res.status(200).json(savedMessage);
    } catch (e) {
      console.error("Error saving message:", e.message);
      res.status(400).json({ message: e.message });
    }
  });


  app.post('/chats', async (req, res) => {
    try {
        const { participants } = req.body;

        if (!participants || !Array.isArray(participants) || participants.length < 2) {
            return res.status(400).json({ message: "Participants must be an array with at least 2 user IDs" });
        }

        const chat = new Chat({
            participants,
            createdAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString(),
        });

        const savedChat = await chat.save();
        res.status(201).json(savedChat);
    } catch (e) {
        console.error("Error creating chat:", e.message);
        res.status(500).json({ message: "Failed to create chat: " + e.message });
    }
});

app.post('/login', async (req, res) => { // this one was with ai because i was getting errors and couldnt figure it out
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

//=============================================================== UPDATE

app.patch(`/reset-pass/:userId`, async (req, res) => {
    const { userId } = req.params;
    const { old_password, new_password } = req.body;

    try {
        if (!old_password || !new_password) {
            return res.status(400).json({ message: "Old and new passwords are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: `Couldn't find user: ${userId}` });
        }

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

app.patch(`/change-username/:userId`, async (req, res) => {
    const { userId } = req.params;
    const { new_username } = req.body;

    try {
        const user = await User.findById(userId);
        const existingUser = await User.findOne({ username: new_username });

        
        if (!new_username) {
            return res.status(400).json({ message: "New username (new_username) is required" });
        }
        if (!user) {
            return res.status(400).json({ message: `Couldn't find user: ${userId}` });
        }
        if (existingUser && existingUser._id !== userId) {
            return res.status(400).json({ message: `Username ${new_username} is already taken` });
        }


        user.username = new_username;
        await user.save();

        res.status(200).json({ message: "Username updated successfully" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

//=============================================================== DELETE

//===============================================================

app.listen(3307, () => console.log('Server is running on port 3307'));