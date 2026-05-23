const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { authMiddleware, staffOnly } = require('../middleware/auth');

// Get active announcements (all users)
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all announcements (staff)
router.get('/all', authMiddleware, staffOnly, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create announcement (staff)
router.post('/', authMiddleware, staffOnly, async (req, res) => {
  try {
    const ann = await Announcement.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle active (staff)
router.put('/:id', authMiddleware, staffOnly, async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete (staff)
router.delete('/:id', authMiddleware, staffOnly, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
