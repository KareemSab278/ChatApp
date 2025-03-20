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
    _id: String,
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    _id: String,
    participants: {type: Array},
    createdAt: { type: Date, default: Date.now },
    lastMessageAt : {type: Date, default: Date.now}
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

app.get('/users', async(req, res)=>{    //this is for getting all users. (will be searching users through frontend)
    try{
        const users = await User.find({})
        res.status(200).json(users)
        console.log(users.map(user => user._id.toString()));
    } catch(error){
        res.status(400).json({message: error.message})
    }
});


app.get('/chats', async (req, res)=>{   //this is to get all chats
    try{
        const chats = await Chat.find({})
        res.status(200).json(chats)
        console.log(chats.map(chat => chat._id.toString()));
    } catch (e) {
        res.status(400).json({message: e.message})
    }
});

app.get('/chats/:participant', async (req, res) => {    //users can see which chats theyre participants of (otherwise theyll end up seeing every chat in the app across multiple accounts)
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



app.get('/messages', async(req, res)=>{     //get all messages (this is for filtering bad words in conversations so i can ban users)
    try{
        const messages = await Message.find({})
        res.status(200).json(messages)
    } catch(e){
        res.status(400).json({message: e.message})
    }
})

app.get(`/messages/:_id`, async(req, res)=>{    // get messages by chat
    try{
        const{_id} = req.params;
        const messages = await Message.find({ chatId: _id });
        res.status(200).json(messages)
    } catch(e){
        res.status(400).json({message: e.message})
    }
})


//=============================================================== CREATE

app.post(`/new-user`, async (req,res) => {
    try{
    const account = {
        username : req.body.username,
        _id : req.body.id,
        password : req.body.password,
        CreatedAt: Date.now()
    }
    await new User(account).save()
    res.status(200).json({ message: "User created successfully" })}
catch (e){
    res.status(400).json({message: e.message})
}
})

app.post(`/new-mssg`, async (req,res) => {
    try{
        const message = {
            _id : req.body.id,
            chatId : req.body.chatId,
            senderId : req.body.sender,
            content : req.body.content,
            timestamp: Date.now(),
            isRead : false
        }
        await new Message(message).save()
        res.status(200).json({message : "message sent!"})
    }
    catch (e){
        res.status(400).json({message: e.message})
    }
})

app.post(`/new-chat`,async (req,res)=>{
    try{
        const chat = {
            _id : req.body.chatId,
            participants : req.body.participant,
            createdAt : Date.now(),
            lastMessageAt : new Date()
        }
        await new Chat(chat).save()
        res.status(200).json({message: "chat created!"})
    }
    catch (e){
        res.status(400).json({message : e.message})
    }
})

//=============================================================== UPDATE 3

//=============================================================== DELETE 4

//===============================================================



app.listen(3307, () => console.log('server is running on port 3307'))