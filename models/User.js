import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    fitnessGoals: {
        type: String,
        default: '',
    },
    preferences: {
        type: [String], // Array of preferences (e.g., ['yoga', 'strength training'])
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema, 'users');

export default User; // Export the User model