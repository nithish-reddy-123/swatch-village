
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI ;
console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const chatRoutes = require('./routes/chat');
const announcementRoutes = require('./routes/announcements');
const eventRoutes = require('./routes/events');
const emergencyContactRoutes = require('./routes/emergencyContacts');
const schemeRoutes = require('./routes/schemes');
const directoryRoutes = require('./routes/directory');

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/directory', directoryRoutes);

app.get('/', (req, res) => {
    res.send('Swatch Village Backend is running');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
