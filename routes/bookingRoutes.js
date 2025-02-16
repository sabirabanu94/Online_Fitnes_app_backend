// routes/bookingRoutes.js
const express = require('express');
const { createBooking, getUserBookings, getBookingById, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create a new booking
router.post('/', authenticate, createBooking);

// Get all bookings for a user
router.get('/', authenticate, getUserBookings);

// Get booking by ID
router.get('/:id', authenticate, getBookingById);

// Update booking status or feedback
router.put('/:id', authenticate, updateBooking);

// Delete booking
router.delete('/:id', authenticate, deleteBooking);

module.exports = router;