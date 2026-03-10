const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    eligibility: {
        type: String,
        default: ''
    },
    benefits: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['agriculture', 'education', 'health', 'housing', 'employment', 'women', 'senior-citizen', 'other'],
        default: 'other'
    },
    applicationLink: {
        type: String,
        default: ''
    },
    deadline: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);
