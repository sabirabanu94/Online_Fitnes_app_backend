const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class', // Reference to the Class model
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['confirmed', 'canceled', 'completed'],
        default: 'confirmed',
    },
    feedback: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('Booking', BookingSchema, 'bookings');