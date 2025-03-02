const express = require('express');
const { createUser , loginUser , getUserProfile, updateUser, deleteUser  } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; // Get user data from the request body

    // Validate incoming data
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required: name, email, password' });
    }

    try {
        const newUser = await createUser({ name, email, password }); // Create a new user
        res.status(201).json({ message: 'User created successfully', user: newUser }); // Send
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user', details: error.message }); // Handle errors
    }
}
);

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Get login data from the request body

    // Validate incoming data
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required: email, password' });
    }

    try {
        const user = await loginUser({ email, password }); // Log in the user
        res.status(200).json({ message: 'Login successful', user }); // Send success response
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(401).json({ error: 'Login failed', details: error.message }); // Handle errors
    }
}
);

// Get user profile

router.get('/profile', async (req, res) => {
    const { user } = req; // Get the user from the request object
    res.status(200).json(user); // Send the user as a response
}
);

// Update user profile
router.put('/profile', async (req, res) => {
    const { user } = req; // Get the user from the request object
    const { name, email, password } = req.body; // Get user data from the request body

    // Validate incoming data
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required: name, email, password' });
    }

    try {
        const updatedUser = await updateUser(user, { name, email, password }); // Update the user
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser }); // Send success response
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile', details: error.message }); // Handle errors
    }
}
); 

// Delete user account
router.delete('/profile', async (req, res) => {
    const { user } = req; // Get the user from the request object

    try {
        await deleteUser(user); // Delete the user
        res.status(200).json({ message: 'User deleted successfully' }); // Send success response
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user', details: error.message }); // Handle errors
    }
});

module.exports = router;