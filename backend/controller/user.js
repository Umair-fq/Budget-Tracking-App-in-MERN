const { User, validate } = require('../model/user');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        console.log('Starting user registration process...');

        const { error } = validate(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });
        if (user) {
            console.log('User already exists with email:', req.body.email);
            return res.status(409).send({ message: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        console.log('Hashed password:', hashPassword);

        await new User({ ...req.body, password: hashPassword }).save();
        console.log('User saved successfully.');
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
