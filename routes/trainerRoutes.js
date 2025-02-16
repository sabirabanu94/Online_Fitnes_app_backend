const { authenticate } = require('../middleware/auth');

const express = require('express');
const { createTrainer, getAllTrainers, getTrainerById, updateTrainer, deleteTrainer } = require('../controllers/trainerController');

const router = express.Router();

// Create a new trainer
router.post('/', createTrainer);

// Get all trainers
router.get('/', getAllTrainers);

// Get trainer by ID
router.get('/:id', getTrainerById);

// Update trainer profile
router.put('/:id', updateTrainer);

// Delete trainer
router.delete('/:id', deleteTrainer);

module.exports = router;
