const express = require('express');
const { createUser , loginUser , getUserProfile, updateUser, deleteUser  } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// User registration
router.post('/register', createUser );

// User login
router.post('/login', loginUser );

// Get user profile
router.get('/profile', authenticate, getUserProfile); 

// Update user profile
router.put('/profile', authenticate, updateUser); 

// Delete user account
router.delete('/profile', authenticate, deleteUser ); 

module.exports = router;