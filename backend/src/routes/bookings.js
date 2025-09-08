const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Product = require('../models/Product');

// Create a booking (user)
router.post('/', auth, async (req, res, next) => {
  try {
    const { productId, appointmentDate, appointmentTime, notes, customerName, customerEmail, customerPhone, customerLocation } = req.body;
    const product = await Product.findById(productId).populate('owner');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const booking = await Booking.create({
      product: product._id,
      tailor: product.owner._id,
      customer: {
        id: req.user.id,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        location: customerLocation,
      },
      appointmentDate,
      appointmentTime,
      notes,
    });

    res.status(201).json({ booking });
  } catch (e) {
    next(e);
  }
});

// Get my bookings (user)
router.get('/mine', auth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ 'customer.id': req.user.id })
      .populate('product', 'name images')
      .populate('tailor', 'firstName lastName brandName phone location');
    res.json({ bookings });
  } catch (e) {
    next(e);
  }
});

// Get bookings for my products (admin)
router.get('/for-my-products', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const bookings = await Booking.find({ tailor: req.user.id })
      .populate('product', 'name images')
      .populate('customer.id', 'firstName lastName email');
    res.json({ bookings });
  } catch (e) {
    next(e);
  }
});

// Update booking status (admin)
router.patch('/:id/status', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, tailor: req.user.id },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json({ booking });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
