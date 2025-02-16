const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    qualifications: {
        type: String,
        required: true,
    },
    expertise: {
        type: [String], // Array of areas of expertise (e.g., ['yoga', 'nutrition'])
        required: true,
    },
    profilePicture: {
        type: String, // URL to the profile picture
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    ratings: {
        type: [Number], // Array of ratings
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Trainer', TrainerSchema);
