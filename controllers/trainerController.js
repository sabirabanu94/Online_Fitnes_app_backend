const Trainer = require('../models/Trainer');
const {authenticate} = require('../middleware/auth');

// Create a new trainer
const createNewTrainer = (req, res) => {
    const { body } = req; // Get the request body
    if (!body.name || !body.specialty) {
        return res.status(400).send({ status: "FAILED", error: "Missing required fields" }); // Validate input
    }
    const newTrainer = trainerService.createNewTrainer(body); // Create the trainer
    res.status(201).send({ status: "OK", data: newTrainer }); // Send the created trainer as a response
};

//update trainer
const updateOneTrainer = (req, res) => {
    const { trainerId } = req.params; // Get the trainer ID from the URL parameters
    const updatedTrainer = trainerService.updateOneTrainer(trainerId, req.body); // Update the trainer
    if (!updatedTrainer) {
        return res.status(404).send({ status: "FAILED", error: "Trainer not found" }); // Handle not found
    }
    res.send({ status: "OK", data: updatedTrainer }); // Send the updated trainer as a response
};
// Get all trainers
const deleteOneTrainer = (req, res) => {
    const { trainerId } = req.params; // Get the trainer ID from the URL parameters
    const result = trainerService.deleteOneTrainer(trainerId); // Delete the trainer
    if (!result) {
        return res.status(404).send({ status: "FAILED", error: "Trainer not found" }); // Handle not found
    }
    res.status(204).send({ status: "OK" }); // Send a success response
};


