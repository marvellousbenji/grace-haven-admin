const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const Product = require('../models/Product');

// Public list products (optional filter by owner)
router.get('/', async (req, res, next) => {
  try {
    const { owner } = req.query;
    const filter = owner ? { owner } : {};
    const products = await Product.find(filter).populate('owner', 'firstName lastName brandName phone location');
    res.json({ products });
  } catch (e) {
    next(e);
  }
});

// Create product (admin only)
router.post('/', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const payload = { ...req.body, owner: req.user.id };
    const product = await Product.create(payload);
    res.status(201).json({ product });
  } catch (e) {
    next(e);
  }
});

// Update own product
router.put('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ product });
  } catch (e) {
    next(e);
  }
});

// Delete own product
router.delete('/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
