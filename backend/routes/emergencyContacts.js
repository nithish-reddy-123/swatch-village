const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const contacts = await EmergencyContact.find(filter).sort({ category: 1, name: 1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add contact (admin)
router.post('/', async (req, res) => {
    try {
        const { name, category, phone, alternatePhone, address, isAvailable24x7, userId } = req.body;
        if (!name || !category || !phone) {
            return res.status(400).json({ error: 'Name, category, and phone are required' });
        }
        const contact = new EmergencyContact({
            name,
            category,
            phone,
            alternatePhone: alternatePhone || '',
            address: address || '',
            isAvailable24x7: isAvailable24x7 || false,
            addedBy: userId
        });
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete contact
router.delete('/:id', async (req, res) => {
    try {
        await EmergencyContact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
