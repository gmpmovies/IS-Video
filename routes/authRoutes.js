const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    
    try{
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).send({ error: "User with this email already exists" });
        }
        const newUser = new User({email, password, name});

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY);
        res.send({ token });
    } catch (err) {
        return res.status(400).send({ error: err.message});
    }
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).send({ error: "Username and password must be provided."});
    }
    try{
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).send({ error: "Invalid password or email" });
        }

        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
        res.send({ token: token });
    } catch (err) {
        return res.status(400).send({ error: "Invalid password or email" });
    }
    
})

module.exports = router;