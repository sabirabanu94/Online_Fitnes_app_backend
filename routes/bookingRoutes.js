// routes/bookingRoutes.js
const express = require('express');
const { createBooking, getUserBookings, getBookingById, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create a new booking
router.post('/',async (res,req) => {
    const { classId, userId, date, time } = req.body; // Get booking data from the request body

    // Validate incoming data
    if (!classId || !userId || !date || !time) {
        return res.status(400).json({ error: 'All fields are required: classId, userId, date, time' });
    }

    try {
        const newBooking = await createBooking({ classId, userId, date, time }); // Create a new booking
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking }); // Send
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking', details: error.message }); // Handle errors
    }
} );

// Get all bookings for a user
router.get('/user',async(res,req) => {
    const { userId } = req.body; // Get the user ID from the request body

    try {
        const bookings = await getUserBookings(userId); // Fetch all bookings for the user
        res.status(200).json(bookings); // Send the list of bookings as a response
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}
);

// Get booking by ID
router.get('/:id',async (res,req) => {
    const { id } = req.params; // Get the booking ID from the request parameters

    try {
        const booking = await getBookingById(id); // Fetch the booking by ID
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' }); // Handle not found
        }
        res.status(200).json(booking); // Send the booking as a response
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
}
);

// Update booking status or feedback
router.put('/:id', async(res,req) => {
    const { id } = req.params; // Get the booking ID from the request parameters
    const { status, feedback } = req.body; // Get booking data from the request body

    try {
        const updatedBooking = await updateBooking(id, { status, feedback }); // Update the booking
        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking }); // Send
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Failed to update booking', details: error.message }); // Handle errors
    }
}
);

// Delete booking
router.delete('/:id', async(res,req) => {   
    const { id } = req.params; // Get the booking ID from the request parameters

    try {
        const deletedBooking = await deleteBooking(id); // Find and delete the booking by ID

        if (!deletedBooking) {
            return res.status(404).json({ error: 'Booking not found' }); // If no booking is found, return a 404 error
        }

        res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking }); // Return success message
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking', details: error.message }); // Return error message
    }
}
);

module.exports = router;