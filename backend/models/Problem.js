const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    wardNumber: {
        type: Number,
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'solved'],
        default: 'pending'
    },
    imageUrl: {
        type: String
    },
    location: {
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
