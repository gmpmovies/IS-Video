require('dotenv').config();
//Import Models
require('./models/User');

const express = require('express');
const cors = require('cors');
const path = require('path')
const mongoose = require('mongoose');

const authRouter = require('./routes/authRoutes');
const signedInRoutes = require('./routes/signedInRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to the Database
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance.');
});
mongoose.connection.on('error', (error) => {
    console.error('Error connecting to mongo.', error);
})

// Setup API Routes
app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.use('/auth', authRouter);
app.use('/user', signedInRoutes);

// Listener
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})