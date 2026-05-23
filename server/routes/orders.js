const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const { authMiddleware, staffOnly } = require('../middleware/auth');

// Setup multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Student: place order
router.post('/', authMiddleware, upload.array('files'), async (req, res) => {
  try {
    const { type, items, printJobs, notes, totalAmount } = req.body;

    const parsedItems = items ? JSON.parse(items) : [];
    const parsedPrintJobs = printJobs ? JSON.parse(printJobs) : [];

    // Check stock and deduct
    for (const orderItem of parsedItems) {
      const item = await Item.findById(orderItem.item);
      if (!item) return res.status(404).json({ message: `Item not found` });
      if (item.stock < orderItem.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${item.name}". Available: ${item.stock}` });
      }
      item.stock -= orderItem.quantity;
      await item.save();
    }

    // Attach uploaded file info to print jobs
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, i) => {
        if (parsedPrintJobs[i]) {
          parsedPrintJobs[i].filename = file.filename;
          parsedPrintJobs[i].originalName = file.originalname;
        }
      });
    }

    const order = await Order.create({
      student: req.user.id,
      type,
      items: parsedItems,
      printJobs: parsedPrintJobs,
      notes,
      totalAmount: totalAmount || 0,
      preferredPickup: req.body.preferredPickup || ''
    });

    // Notify student
    await Notification.create({
      user: req.user.id,
      message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed and is pending.`,
      orderId: order._id
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student: get own orders
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user.id })
      .populate('items.item')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Staff: get all orders
router.get('/all', authMiddleware, staffOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('student', 'name email')
      .populate('items.item')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Staff: update order status
router.put('/:id/status', authMiddleware, staffOnly, async (req, res) => {
  try {
    const { status, staffNote, estimatedPickup } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, staffNote, ...(estimatedPickup ? { estimatedPickup } : {}) },
      { new: true }
    ).populate('student', 'name email').populate('items.item');

    // Notify student on status change
    const messages = {
      processing: `Your order #${order._id.toString().slice(-6).toUpperCase()} is now being processed.`,
      ready: `Your order #${order._id.toString().slice(-6).toUpperCase()} is ready for pickup!`,
      collected: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been collected. Thank you!`,
      cancelled: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been cancelled by staff.`
    };
    if (messages[status]) {
      await Notification.create({ user: order.student._id, message: messages[status], orderId: order._id });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student: cancel order
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, student: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Only pending orders can be cancelled' });

    // Restore stock
    for (const orderItem of order.items) {
      await Item.findByIdAndUpdate(orderItem.item, { $inc: { stock: orderItem.quantity } });
    }

    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student: rate a collected order
router.put('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const order = await Order.findOne({ _id: req.params.id, student: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'collected') return res.status(400).json({ message: 'Only collected orders can be rated' });
    order.rating = rating;
    order.feedback = feedback;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student: reorder (get order details to prefill)
router.get('/:id/reorder', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, student: req.user.id }).populate('items.item');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
