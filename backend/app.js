const express = require('express');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const cors = require('cors');
const app = express();

//====================================================================================

app.use(cors());
app.use(express.json());

mongoose
    .connect('mongodb://localhost:27017/chatApp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));
