const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
      email: String,
      phone: String,
      location: String,
    },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    notes: String,
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
