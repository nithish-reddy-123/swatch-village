const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventTime: {
        type: String,
        default: ''
    },
    venue: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['festival', 'meeting', 'health-camp', 'sports', 'cultural', 'education', 'other'],
        default: 'other'
    },
    organizer: {
        type: String,
        default: 'Village Panchayat'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
