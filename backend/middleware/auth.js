const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    try {
        // console.log('Token:', token);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log('Decoded Payload:', decoded); // Add this line

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).send({ message: 'Invalid token.' });
        }
        req.user = user; // Attach the user to the request
        next();
    } catch (error) {
        res.status(400).send({ message: 'Invalid token.' });
    }
}
