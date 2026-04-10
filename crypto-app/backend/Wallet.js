const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balances: [{
    asset: String,
    free: { type: Number, default: 0 },
    locked: { type: Number, default: 0 }
  }],
  totalValueUSD: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);