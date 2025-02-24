const { authenticate } = require('../middleware/auth');

const express = require('express');
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require('../controllers/classController');

const router = express.Router();

// Create a new class
router.post('/', async (req, res) => {
    const { name, type, capacity, trainer, date, time, duration, intensity, location } = req.body; // Get class data from the request body

    // Validate incoming data
    if (!name || !type || !capacity || !trainer || !date || !time || !duration || !intensity || !location) {
        return res.status(400).json({ error: 'All fields are required: name, type, capacity, trainer, date, time, duration, intensity, location' });
    }

    try {
        const newClass = await createClass({ name, type, capacity, trainer, date, time, duration, intensity, location }); // Create a new class
        res.status(201).json({ message: 'Class created successfully', class: newClass }); // Send
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Failed to create class', details: error.message }); // Handle errors
    }
});

// Get all classes
router.get('/', async (req, res) => {
    try {
        const classes = await getAllClasses(); // Fetch all classes from the database
        res.status(200).json(classes); // Send the list of classes as a response
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
});


// Get class by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Get the class ID from the
    try {
        const classes = await getClassById(id); // Fetch the class by ID
        if (!classes) {
            return res.status(404).json({ error: 'Class not found' }); // Handle not found
        }
        res.status(200).json(classes); // Send the class as a response
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({ error: 'Failed to fetch class' });
    }
});

// Update class
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Get the class ID from the
    const { name, type, capacity, trainer, date, time, duration, intensity, location } = req.body; // Get class data from the request body
});

// Delete class
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Get the class ID from the
    try {
        const deletedClass = await deleteClass(id); // Find and delete the class by ID

        if (!deletedClass) {
            return res.status(404).json({ error: 'Class not found' }); // If no class is found, return a 404 error
        }

        res.status(200).json({ message: 'Class deleted successfully', class: deletedClass }); // Return success message
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ error: 'Failed to delete class', details: error.message }); // Return error message
    }
});

module.exports = router;