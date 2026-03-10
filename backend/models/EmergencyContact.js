const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['police', 'hospital', 'fire', 'ambulance', 'panchayat', 'electricity', 'water', 'other'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    alternatePhone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    isAvailable24x7: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
