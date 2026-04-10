const express = require('express');
const User = require('./User');
const Transaction = require('./Transaction');
const { authMiddleware, adminOnly } = require('./authMiddleware');

const router = express.Router();
router.use(authMiddleware, adminOnly);

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  res.json(user);
});

router.post('/users/:id/kyc/approve', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { kycStatus: 'verified' }, { new: true }).select('-password');
  res.json(user);
});

router.get('/transactions', async (req, res) => {
  const txs = await Transaction.find().sort({ createdAt: -1 });
  res.json(txs);
});

router.get('/stats', async (req, res) => {
  const totalUsers = await User.countDocuments();
  const pendingKYC = await User.countDocuments({ kycStatus: 'pending' });
  res.json({ totalUsers, pendingKYC, totalVolume: 1234567, activeOrders: 42 });
});

module.exports = router;