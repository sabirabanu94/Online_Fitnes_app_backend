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
        const allowedOrigins = 'http://localhost:5174/';
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
//create a new user

app.post('api/users', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required: name, email, password' });
    }
    try {
        const newUser = await createUser({ name, email, password });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
}
);

//fetch all users
app.get('api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}
);

//update the user profile

app.put('api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            name,
            email,
            password
        }, { new: true });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});
 //Delete the usser
 
 app.delete ('api/users/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const deletedUser = await User.findByIdAndDelete(id);
            res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user', details: error.message });
        }
    }
    );

    //To create a class

    app.post('api/classes', async (req, res) => {   
        const { name, type, capacity, trainer, date, time, duration, intensity, location } = req.body;
        if (!name || !type || !capacity || !trainer || !date || !time || !duration || !intensity || !location) {
            return res.status(400).json({ error: 'All fields are required: name, type, capacity, trainer, date, time, duration, intensity, location' });
        }
        try {
            const newClass = await createClass({ name, type, capacity, trainer, date, time, duration, intensity, location });
            res.status(201).json({ message: 'Class created successfully', class: newClass });
        } catch (error) {   
            console.error('Error creating class:', error);
            res.status(500).json({ error: 'Failed to create class', details: error.message });
        }
    }
    );
    //To fetch all classes
    app.get ('api/classes', async (req, res) => {   

        try {
            const classes = await getAllClasses();
            res.status(200).json(classes);
        } catch (error) {
            console.error('Error fetching classes:', error);
            res.status(500).json({ error: 'Failed to fetch classes' });
        }
    }
    );

    //To get class by ID

    app.get ('api/classes/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const classes = await getClassById(id);
            if (!classes) {
                return res.status(404).json({ error: 'Class not found' });
            }
            res.status(200).json(classes);
        } catch (error) {
            console.error('Error fetching class:', error);
            res.status(500).json({ error: 'Failed to fetch class' });
        }
    }
    );

    //To update class
    app.put ('api/classes/:id', async (req, res) => {   
        const { id } = req.params;
        const { name, type, capacity, trainer, date, time, duration, intensity, location } = req.body;
        try {
            const updatedClass = await updateClass(id, { name, type, capacity, trainer, date, time, duration, intensity, location });
            res.status(200).json({ message: 'Class updated successfully', class: updatedClass });
        } catch (error) {
            console.error('Error updating class:', error);
            res.status(500).json({ error: 'Failed to update class', details: error.message });
        }   
    }
    );
    //to delete class
    app.delete ('api/classes/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const deletedClass = await deleteClass(id);
            res.status(200).json({ message: 'Class deleted successfully', class: deletedClass });
        } catch (error) {
            console.error('Error deleting class:', error);
            res.status(500).json({ error: 'Failed to delete class', details: error.message });
        }
    }
    );
    
    //to create a booking
app.post ('api/bookings', async (req, res) => { 
    const { classId, userId, date, time } = req.body;
    if (!classId || !userId || !date || !time) {
        return res.status(400).json({ error: 'All fields are required: classId, userId, date, time' });
    }
    try {
        const newBooking = await createBooking({ classId, userId, date, time });
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
}
);
//to cancel a booking
app.delete ('api/bookings/:id', async (req, res) => {       
    
    const { id } = req.params;
    try {
        const deletedBooking = await deleteBooking(id);
        res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking', details: error.message });
    }
}       
);

//to create trainer profile
app.post ('api/trainers', async (req, res) => {
    const { username, name, specialty, experience } = req.body;
    if (!username || !name || !specialty || experience === undefined) {
        return res.status(400).json({ error: 'All fields are required: username, name, specialty, experience' });
    }
    try {
        const newTrainer = new Trainer({ username, name, specialty, experience });
        await newTrainer.save();
        res.status(201).json({ message: 'Trainer created successfully', trainer: newTrainer });
    } catch (error) {
        console.error('Error creating trainer:', error);
        res.status(500).json({ error: 'Failed to create trainer', details: error.message });
    }
}
);

//to fetch all trainers
app.get ('api/trainers', async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.status(200).json(trainers);
    } catch (error) {
        console.error('Error fetching trainers:', error);
        res.status(500).json({ error: 'Failed to fetch trainers' });
    }
}
);
//to update the trainer by id   \
app.put ('api/trainers/:id', async (req, res) => {
    const { id } = req.params;
    const { username, name, specialty, experience } = req.body;
    try {
        const updatedTrainer = await Trainer.findByIdAndUpdate
        (id, {
            username,
            name,
            specialty,
            experience
        }
    );
        res.status(200).json({ message: 'Trainer updated successfully', trainer: updatedTrainer });
    } catch (error) {
        console.error('Error updating trainer:', error);
        res.status(500).json({ error: 'Failed to update trainer', details: error.message });
    }
}
);
//to delete the trainer by id

app.delete ('api/trainers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTrainer = await Trainer.findByIdAndDelete(id);
        res.status(200).json({ message: 'Trainer deleted successfully', trainer: deletedTrainer });
    } catch (error) {
        console.error('Error deleting trainer:', error);
        res.status(500).json({ error: 'Failed to delete trainer', details: error.message });
    }
}
);

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