const Class = require('../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
    const { title, description, type, duration, trainer, schedule } = req.body;

    try {
        const newClass = new Class({ title, description, type, duration, trainer, schedule });
        await newClass.save();
        res.status(201).json({ message: 'Class created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('trainer', 'name expertise');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get class by ID
exports.getClassById = async (req, res) => {
    try {
        const fitnessClass = await Class.findById(req.params.id).populate('trainer', 'name expertise');
        if (!fitnessClass) return res.status(404).json({ message: 'Class not found' });
        res.json(fitnessClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update class
exports.updateClass = async (req, res) => {
    const { title, description, type, duration, schedule } = req.body;

    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, { title, description, type, duration, schedule }, { new: true });
        res.json(updatedClass);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete class
exports.deleteClass = async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};