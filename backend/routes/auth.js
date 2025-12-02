const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register (for testing/seeding)
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, wardNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'user already exists' });
        }

        const user = new User({ username, password, role, wardNumber });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
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
