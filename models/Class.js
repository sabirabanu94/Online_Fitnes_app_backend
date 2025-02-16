const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    type: {
        type: String, // e.g., 'yoga', 'strength training', 'cardio'
        required: true,
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer', // Reference to the Trainer model
        required: true,
    },
    schedule: [{
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String, // e.g., '10:00 AM'
            required: true,
        },
        availableSlots: {
            type: Number,
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Class', ClassSchema);