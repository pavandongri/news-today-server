const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '15m' });

        res.status(201).json({ message: 'success', token, user: savedUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        const userObj = { _id: user?._id, name: user?.name, email: user?.email }

        res.status(200).json({ message: 'Login successful', token, user: userObj });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};


const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};


const verifyToken = async (req, res) => {
    try {
        const token = req?.body?.token;

        if (!token) {
            return res.status(400).json({ valid: false, message: 'No token provided' });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ valid: false, message: 'Invalid token' });
            }

            return res.status(200).json({ valid: true, message: 'Token is valid' });
        });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyToken
};
