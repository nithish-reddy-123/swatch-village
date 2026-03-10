const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// Get all active schemes
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { isActive: true };
        if (category) filter.category = category;
        const schemes = await Scheme.find(filter)
            .populate('addedBy', 'username')
            .sort({ createdAt: -1 });
        res.json(schemes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add scheme (admin)
router.post('/', async (req, res) => {
    try {
        const { title, description, eligibility, benefits, category, applicationLink, deadline, userId } = req.body;
        if (!title || !description || !userId) {
            return res.status(400).json({ error: 'Title, description, and userId are required' });
        }
        const scheme = new Scheme({
            title,
            description,
            eligibility: eligibility || '',
            benefits: benefits || '',
            category: category || 'other',
            applicationLink: applicationLink || '',
            deadline: deadline || null,
            addedBy: userId
        });
        await scheme.save();
        res.status(201).json(scheme);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete scheme
router.delete('/:id', async (req, res) => {
    try {
        await Scheme.findByIdAndDelete(req.params.id);
        res.json({ message: 'Scheme deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
