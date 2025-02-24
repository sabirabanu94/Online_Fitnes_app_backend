import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticate } from './middleware/auth.js';
import Razorpay from 'razorpay';
import userRoutes from './routes/userRoutes.js';    
import trainerRoutes from './routes/trainerRoutes.js';
import classRoutes from './routes/classRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    appInfo: {
        name: 'Online Fitness App',
        version: '1.0.0',
    }
});

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// Create Express app
const app = express();

// Middleware setup
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5001', 'https://onlinefitnessapp.netlify.app/'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));

app.use(express.json()); // Use express's built-in JSON parser

// Route setup
app.use('/users', userRoutes);
app.use('/trainers', trainerRoutes);
app.use('/classes', classRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);

// Protected route example
app.use('/protected', authenticate, (req, res) => {
    res.json({ message: 'Protected route' });
});

// Razorpay order creation
app.post('/create-order', async (req, res) => {
    const options = {
        amount: req.body.amount,
        currency: 'INR',
        receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    };
    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Razorpay payment verification
app.post('/verify-payment', async (req, res) => {
    const { orderId, paymentId, signature } = req.body;
    try {
        const isValid = razorpay.validateWebhookSignature(JSON.stringify(req.body), signature);
        if (isValid) {
            res.json({ message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export the app
export default app;