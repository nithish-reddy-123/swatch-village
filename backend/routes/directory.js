const express = require('express');
const router = express.Router();
const Directory = require('../models/Directory');

// Get all listings
router.get('/', async (req, res) => {
    try {
        const { category, wardNumber } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (wardNumber) filter.wardNumber = wardNumber;
        const listings = await Directory.find(filter).sort({ category: 1, businessName: 1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add listing
router.post('/', async (req, res) => {
    try {
        const { businessName, ownerName, category, phone, address, wardNumber, timings, userId } = req.body;
        if (!businessName || !category || !phone) {
            return res.status(400).json({ error: 'Business name, category, and phone are required' });
        }
        const listing = new Directory({
            businessName,
            ownerName: ownerName || '',
            category,
            phone,
            address: address || '',
            wardNumber: wardNumber || null,
            timings: timings || '',
            addedBy: userId
        });
        await listing.save();
        res.status(201).json(listing);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete listing
router.delete('/:id', async (req, res) => {
    try {
        await Directory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
