const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  side: String,
  price: Number,
  amount: Number,
  total: Number,
  fee: Number
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);