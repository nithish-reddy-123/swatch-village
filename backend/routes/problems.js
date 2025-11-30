const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Get all problems (can filter by ward)
router.get('/', async (req, res) => {
    try {
        const { wardNumber } = req.query;
        const filter = wardNumber ? { wardNumber } : {};
        const problems = await Problem.find(filter).populate('reportedBy', 'username').sort({ createdAt: -1 });
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Report a problem
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { description, wardNumber, userId, lat, lng } = req.body;

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const problemData = {
            description,
            wardNumber,
            reportedBy: userId,
            location: { lat, lng }
        };

        if (req.file) {
            problemData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const problem = new Problem(problemData);

        await problem.save();
        res.status(201).json(problem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update problem status (Admin only)
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const problem = await Problem.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(problem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
