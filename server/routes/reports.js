const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');
const { authMiddleware, staffOnly } = require('../middleware/auth');

// Summary report
router.get('/summary', authMiddleware, staffOnly, async (req, res) => {
  try {
    const { range } = req.query; // 'today' | 'week' | 'month'
    const now = new Date();
    let from = new Date(0);
    if (range === 'today') { from = new Date(now); from.setHours(0,0,0,0); }
    else if (range === 'week') { from = new Date(now - 7 * 24 * 60 * 60 * 1000); }
    else if (range === 'month') { from = new Date(now - 30 * 24 * 60 * 60 * 1000); }

    const orders = await Order.find({ createdAt: { $gte: from } }).populate('items.item');

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const byStatus = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

    // Top items
    const itemCount = {};
    orders.forEach(o => o.items.forEach(oi => {
      const name = oi.item?.name || 'Unknown';
      itemCount[name] = (itemCount[name] || 0) + oi.quantity;
    }));
    const topItems = Object.entries(itemCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

    // Low stock items
    const lowStock = await Item.find({ stock: { $lt: 10 } }).sort({ stock: 1 });

    res.json({ totalOrders, totalRevenue, byStatus, topItems, lowStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
