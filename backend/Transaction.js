const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit','withdrawal','trade','fee'] },
  asset: String,
  amount: Number,
  status: { type: String, enum: ['pending','completed','failed'], default: 'pending' },
  metadata: mongoose.Schema.Types.Mixed,
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);