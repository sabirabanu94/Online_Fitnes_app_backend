const { authenticate } = require('../middleware/auth');

const express = require('express');
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require('../controllers/classController');

const router = express.Router();

// Create a new class
router.post('/', createClass);

// Get all classes
router.get('/', getAllClasses);

// Get class by ID
router.get('/:id', getClassById);

// Update class
router.put('/:id', updateClass);

// Delete class
router.delete('/:id', deleteClass);

module.exports = router;