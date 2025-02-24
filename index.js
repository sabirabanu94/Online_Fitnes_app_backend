import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Trainer from './models/Trainer.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Stripe with your secret API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    appInfo: {
        name: 'Online Fitness App',
        version: '1.0.0',
    }
});

// Create Express app
const app = express();
app.use(express.json());

// Example route to create a payment intent
// app.post('/create-payment-intent', async (req, res) => {
//     const { amount } = req.body;

//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency: 'usd',
//         });
//         res.status(200).json(paymentIntent);
//     } catch (error) {
//         console.error('Error creating payment intent:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// to create a new user

// Define API endpoint to create a new user
app.post('/api/users', async (req, res) => {
    const { username, name, email, password } = req.body;

    // Validate incoming data
    if (!username || !name || !email || !password) {
        return res.status(400).json({ error: 'Username, name, email, and password are required.' });
    }

    try {
        const newUser  = new User({ username, name, email, password });
        await newUser .save();
        res.status(201).json({ message: 'User  created successfully', user: newUser  });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
});
// Define API endpoint to get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the list of users as a response
    } catch (error) {
        console.error('Error fetching users:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch users', details: error.message }); // Include error details
    }
});
app.put('/api/users/:id', async (req, res) => {
    const userId = req.params.id; // Get the user ID from the URL parameters
    const { username, name, email, password } = req.body; // Get updated data from the request body

    // Validate incoming data
    if (!username && !name && !email && !password) {
        return res.status(400).json({ error: 'At least one field (username, name, email, password) is required to update.' });
    }

    try {
        // Find the user by ID and update the fields that are provided
        const updatedUser  = await User.findByIdAndUpdate(
            userId,
            { username, name, email, password }, // Update fields
            { new: true, runValidators: true } // Options: return the updated document and run validators
        );

        if (!updatedUser ) {
            return res.status(404).json({ error: 'User  not found' });
        }

        res.status(200).json({ message: 'User  updated successfully', user: updatedUser  });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});
// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id; // Get the user ID from the URL parameters

    try {
        const deletedUser  = await User.findByIdAndDelete(userId); // Find and delete the user by ID

        if (!deletedUser ) {
            return res.status(404).json({ error: 'User  not found' }); // If no user is found, return a 404 error
        }

        res.status(200).json({ message: 'User  deleted successfully', user: deletedUser  }); // Return success message
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user', details: error.message }); // Return error message
    }
});

// Define API endpoint to create a new trainer

app.get('/api/trainers', async (req, res) => {
    try {
        const trainers = await Trainer.find(); // Fetch all trainers from the database
        res.status(200).json(trainers); // Send the list of trainers as a response
    } catch (error) {
        console.error('Error fetching trainers:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch trainers', details: error.message }); // Include error details
    }
});
app.post('/api/trainers', async (req, res) => {
    const { username, name, specialty, experience } = req.body; // Get trainer data from the request body

    // Validate incoming data
    if (!username || !name || !specialty || experience === undefined) {
        return res.status(400).json({ error: 'All fields are required: username, name, specialty, experience' });
    }

    try {
        const newTrainer = new Trainer({ username, name, specialty, experience }); // Create a new trainer instance
        await newTrainer.save(); // Save the trainer to the database
        res.status(201).json({ message: 'Trainer created successfully', trainer: newTrainer }); // Send success response
    } catch (error) {
        console.error('Error creating trainer:', error);
        res.status(500).json({ error: 'Failed to create trainer', details: error.message }); // Handle errors
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectToDatabase();
//define the api endpoints for the app