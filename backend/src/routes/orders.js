const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create order (user)
router.post('/', auth, async (req, res, next) => {
  try {
    const { items, measurements } = req.body; // [{ productId, quantity, size, color }]
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'No items' });

    const populated = await Promise.all(
      items.map(async (it) => {
        const p = await Product.findById(it.productId);
        if (!p) {
          const err = new Error('Product not found');
          err.status = 400;
          throw err;
        }
        return {
          product: p._id,
          tailor: p.owner,
          quantity: it.quantity || 1,
          size: it.size,
          color: it.color,
          price: p.price,
        };
      })
    );

    const total = populated.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: populated,
      total,
      measurements,
    });

    res.status(201).json({ order });
  } catch (e) {
    next(e);
  }
});

// Get my orders (user)
router.get('/mine', auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) {
    next(e);
  }
});

// Get orders for my products (admin)
router.get('/for-my-products', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const orders = await Order.find({ 'items.tailor': req.user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
