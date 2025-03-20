const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//====================================================================================

mongoose
    .connect('mongodb://localhost:27017/chat', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

//====================================================================================

const userSchema = new mongoose.Schema({
    _id: { type: String }, // Still your custom unique ID, but we won't change it
    username: { type: String, required: true, unique: true }, // New mutable field
    f_name: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    _id: String,
    participants: { type: Array },
    createdAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date, default: Date.now }
});

const mssgSchema = new mongoose.Schema({
    _id: String,
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
        console.log(users.map(user => user._id.toString()));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/chats', async (req, res) => {
    try {
        const chats = await Chat.find({});
        res.status(200).json(chats);
        console.log(chats.map(chat => chat._id.toString()));
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

app.get('/chats/:participant', async (req, res) => {
    try {
        const { participant } = req.params;
        const chats = await Chat.find({ participants: participant });
        if (!chats.length) {
            console.log('chat doesn’t exist');
            return res.status(404).json({ message: 'No chats found' });
        }
        res.status(200).json(chats);
        console.log(chats.map(chat => chat._id.toString()));
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
        if (!id) {
            return res.status(400).json({ message: "User ID (_id) is required" });
        }

        const account = {
            _id: id,
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

app.post(`/new-mssg`, async (req, res) => {
    try {
        const { id, chatId, sender, content } = req.body;
        if (!chatId || !sender || !content) {
            return res.status(400).json({ message: "chatId, sender, and content are required" });
        }

        const message = {
            _id: id,
            chatId: chatId,
            senderId: sender,
            content: content,
            timestamp: Date.now(),
            isRead: false
        };
        await new Message(message).save();
        res.status(200).json({ message: "Message sent!" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

app.post(`/new-chat`, async (req, res) => {
    try {
        const { chatId, participant } = req.body;
        if (!chatId || !participant) {
            return res.status(400).json({ message: "chatId and participant are required" });
        }

        const chat = {
            _id: chatId,
            participants: participant,
            createdAt: Date.now(),
            lastMessageAt: Date.now()
        };
        await new Chat(chat).save();
        res.status(200).json({ message: "Chat created!" });
    } catch (e) {
        res.status(400).json({ message: e.message });
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
        if (!new_username) {
            return res.status(400).json({ message: "New username (new_username) is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: `Couldn't find user: ${userId}` });
        }

        const existingUser = await User.findOne({ username: new_username });
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