const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  quantity: { type: Number, default: 1 }
});

const printJobSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  copies: { type: Number, default: 1 },
  colorMode: { type: String, enum: ['black_white', 'color'], default: 'black_white' },
  pageSize: { type: String, enum: ['A4', 'A3', 'Letter'], default: 'A4' },
  doubleSided: { type: Boolean, default: false }
});

const orderSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['stationery', 'print', 'mixed'], required: true },
  items: [orderItemSchema],
  printJobs: [printJobSchema],
  status: {
    type: String,
    enum: ['pending', 'processing', 'ready', 'collected', 'cancelled'],
    default: 'pending'
  },
  totalAmount: { type: Number, default: 0 },
  notes: { type: String },
  staffNote: { type: String },
  estimatedPickup: { type: Date },
  preferredPickup: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
