const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// Get all active announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true })
            .populate('postedBy', 'username')
            .sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create announcement (admin only)
router.post('/', async (req, res) => {
    try {
        const { title, content, category, userId } = req.body;
        if (!title || !content || !userId) {
            return res.status(400).json({ error: 'Title, content, and userId are required' });
        }
        const announcement = new Announcement({
            title,
            content,
            category: category || 'general',
            postedBy: userId
        });
        await announcement.save();
        res.status(201).json(announcement);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
