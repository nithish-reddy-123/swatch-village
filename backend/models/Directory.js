const mongoose = require('mongoose');

const directorySchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    ownerName: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['grocery', 'medical', 'hardware', 'clothing', 'food', 'transport', 'repair', 'agriculture', 'education', 'other'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    wardNumber: {
        type: Number
    },
    timings: {
        type: String,
        default: ''
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Directory', directorySchema);
