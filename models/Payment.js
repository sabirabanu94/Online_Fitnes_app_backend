const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'USD', // Default currency
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking', // Reference to the Booking model
        required: true,
    },
    paymentMethod: {
        type: String, // e.g., 'credit_card', 'paypal', etc.
        required: true,
    },
    transactionId: {
        type: String, // Transaction ID from the payment gateway
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Payment', PaymentSchema);