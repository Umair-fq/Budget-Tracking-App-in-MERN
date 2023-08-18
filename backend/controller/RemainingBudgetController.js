const { User } = require('../model/user');

exports.remainingBudget = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.send({ remainingBudget: user.budget });
    } catch (error) {
        console.error('Error getting user\'s remaining budget:', error);
        res.status(500).send('Error getting user\'s remaining budget');
    }
};