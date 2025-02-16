
const express = require('express');
const { processPayment } = require('../controllers/paymentController'); // Assume you have a payment controller

const router = express.Router();

// Process payment
router.post('/process', processPayment);

module.exports = router;