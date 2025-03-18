const express = require('express');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const cors = require('cors');
const app = express();

//====================================================================================

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


mongoose
    .connect('mongodb://localhost:27017/chat', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));


//=============================================================== CREATE 2

//=============================================================== GET 1

app.get('/users', async(req, res)=>{
    try{
        const users = await User.find({})
        res.status(200).json(users)
    } catch(error){
        res.status(400).json({message: error.message})
    }
})

//=============================================================== UPDATE 3

//=============================================================== DELETE 4

//===============================================================



app.listen(3307, () => console.log('server is running on port 3307'))