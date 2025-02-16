const Trainer = require('../models/Trainer');
const {authenticate} = require('../middleware/auth');

// Create a new trainer
exports.createTrainer = async (req, res) => {
    const { name, email, qualifications, expertise, profilePicture, bio } = req.body;

    try {
        const newTrainer = new Trainer({ name, email, qualifications, expertise, profilePicture, bio });
        await newTrainer.save();
        res.status(201).json({ message: 'Trainer created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get trainer by ID
exports.getTrainerById = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
        res.json(trainer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update trainer profile
exports.updateTrainer = async (req, res) => {
    const { name, qualifications, expertise, profilePicture, bio } = req.body;

    try {
        const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, { name, qualifications, expertise, profilePicture, bio }, { new: true });
        res.json(updatedTrainer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trainer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};
