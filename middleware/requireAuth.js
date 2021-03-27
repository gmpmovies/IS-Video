const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization) {
        return res.status(401).send({ error: 'You must log in' });
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err){
            return res.status(401).send({ error: 'You must log in' });
        }

        const { userId } = payload;

        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).send({ error: 'Session has ended, please login again.' });
        }
        req.user = user;
        next();
    });
}