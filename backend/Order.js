const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  type: String,
  side: String,
  price: Number,
  amount: Number,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);