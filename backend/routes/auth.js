const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, wardNumber } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists, please login' });
        }

        const userData = { username, password, role: role || 'user' };

        // Only include wardNumber for users
        if (userData.role === 'user') {
            if (!wardNumber) {
                return res.status(400).json({ error: 'Ward number is required for users' });
            }
            userData.wardNumber = Number(wardNumber);
        }

        const user = new User(userData);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const data=await User.find();
        const user = await User.findOne({ username });
        if (!user || user.password !== password) { // Simple comparison for MVP
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
