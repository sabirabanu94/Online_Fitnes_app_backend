
import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true }, // in years
});

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;