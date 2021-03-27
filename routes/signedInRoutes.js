const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
router.use(requireAuth);

router.get('/get-user/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const user = await User.find({name: name}, '-password');        
        res.send(user);
    } catch (err) {
        return res.status(400).send({error: err.message});
    }
})

module.exports = router;