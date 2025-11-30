const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: { // In a real app, this should be hashed. For this MVP, we might keep it simple or add hashing later.
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    wardNumber: {
        type: Number, // Only relevant for users
        required: function () { return this.role === 'user'; }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
