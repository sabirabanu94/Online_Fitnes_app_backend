const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key
const authenticate = require('../middleware/auth');
// Process payment
exports.processPayment = async (req, res) => {
    const { amount, bookingId, paymentMethod } = req.body;

    try {
        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: 'usd', // Change to your desired currency
            payment_method: paymentMethod,
            confirm: true,
        });

        // Create a new payment record
        const newPayment = new Payment({
            user: req.user.id, // Assuming you have user authentication
            amount,
            currency: 'usd',
            status: 'completed',
            booking: bookingId,
            paymentMethod,
            transactionId: paymentIntent.id,
        });

        await newPayment.save();

        // Update the booking status if necessary
        await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });

        res.status(200).json({ message: 'Payment successful', payment: newPayment });
    } catch (error) {
        // Handle payment failure
        console.error(error);
        res.status(500).json({ error: 'Payment failed', details: error.message });
    }
};