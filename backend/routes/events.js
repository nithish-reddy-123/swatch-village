const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events (upcoming first)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('createdBy', 'username')
            .sort({ eventDate: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create event (admin only)
router.post('/', async (req, res) => {
    try {
        const { title, description, eventDate, eventTime, venue, category, organizer, userId } = req.body;
        if (!title || !description || !eventDate || !venue || !userId) {
            return res.status(400).json({ error: 'Title, description, date, venue, and userId are required' });
        }
        const event = new Event({
            title,
            description,
            eventDate,
            eventTime: eventTime || '',
            venue,
            category: category || 'other',
            organizer: organizer || 'Village Panchayat',
            createdBy: userId
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
