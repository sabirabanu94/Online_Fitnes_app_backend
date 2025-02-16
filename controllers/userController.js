const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new user
exports.createUser  = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ username, email, password: hashedPassword });
        await newUser .save();
        res.status(201).json({ message: 'User  created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// User login
exports.loginUser  = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User  not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user profile
// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user profile
exports.updateUser = async (req, res) => {
    const { fitnessGoals, preferences } = req.body;

    try {
        const updatedUser  = await User.findByIdAndUpdate(req.user.id, { fitnessGoals, preferences }, { new: true });
        res.json(updatedUser );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete user account
exports.deleteUser  = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'User  deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};