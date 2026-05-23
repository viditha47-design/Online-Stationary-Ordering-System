const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, default: 'general' },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
