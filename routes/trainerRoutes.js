import express from 'express';
import Trainer from '../models/Trainer.js'; // Adjust the path as necessary

const router = express.Router();

// GET all trainers
router.get('/', async (req, res) => {
    try {
        const trainers = await Trainer.find(); // Fetch all trainers from the database
        res.status(200).json(trainers); // Send the list of trainers as a response
    } catch (error) {
        console.error('Error fetching trainers:', error);
        res.status(500).json({ error: 'Failed to fetch trainers' });
    }
});

// GET a specific trainer by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Get the trainer ID from the URL parameters
    try {
        const trainer = await Trainer.findById(id); // Fetch the trainer by ID
        if (!trainer) {
            return res.status(404).json({ error: 'Trainer not found' }); // Handle not found
        }
        res.status(200).json(trainer); // Send the trainer as a response
    } catch (error) {
        console.error('Error fetching trainer:', error);
        res.status(500).json({ error: 'Failed to fetch trainer' });
    }
});

router.post('/', async (req, res) => {
    const { name, specialty } = req.body; // Get the name and specialty from the request body
    if (!name || !specialty) {
        return res.status(400).json({ error: 'Missing required fields' }); // Validate input
    }
    try {
        const newTrainer = await Trainer.create({ name, specialty }); // Create the trainer
        res.status(201).json(newTrainer); // Send the created trainer as a response
    } catch (error) {
        console.error('Error creating trainer:', error);
        res.status(500).json({ error: 'Failed to create trainer' });
    }
});
router.post('/', async (req, res) => {
    const { username, name, specialty, experience } = req.body; // Get trainer data from the request body

    // Validate incoming data
    if (!username || !name || !specialty || experience === undefined) {
        return res.status(400).json({ error: 'All fields are required: username, name, specialty, experience' });
    }

    try {
        const newTrainer = new Trainer({ username, name, specialty, experience }); // Create a new trainer instance
        await newTrainer.save(); // Save the trainer to the database
        res.status(201).json({ message: 'Trainer created successfully', trainer: newTrainer }); // Send success response
    } catch (error) {
        console.error('Error creating trainer:', error);
        res.status(500).json({ error: 'Failed to create trainer', details: error.message }); // Handle errors
    }
});

export default router;