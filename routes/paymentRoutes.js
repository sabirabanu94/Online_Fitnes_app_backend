
const express = require('express');
const { processPayment } = require('../controllers/paymentController'); // Assume you have a payment controller

const router = express.Router();

// Process payment
router.post('/process', async (req, res) => {
    const { amount, currency, source, description } = req.body; // Get payment data from the request body

    // Validate incoming data
    if (!amount || !currency || !source) {
        return res.status(400).json({ error: 'All fields are required: amount, currency, source' });
    }
    
    try {
        const payment = await processPayment({ amount, currency, source, description }); // Process the payment
        res.status(200).json({ message: 'Payment processed successfully', payment }); // Send
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment', details: error.message }); // Handle errors
    }
}); 

module.exports = router;