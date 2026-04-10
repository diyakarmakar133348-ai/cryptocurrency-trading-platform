const express = require('express');
const Wallet = require('./Wallet');
const Transaction = require('./Transaction');
const { authMiddleware } = require('./authMiddleware');

const router = express.Router();

router.get('/balances', authMiddleware, async (req, res) => {
  let wallRoute = await Wallet.findOne({ userId: req.user.userId });
  if (!wallRoute) {
    wallRoute = new Wallet({ userId: req.user.userId, balances: [{ asset: 'USDT', free: 10000, locked: 0 }], totalValueUSD: 10000 });
    await wallRoute.save();
  }
  const prices = { BTC: 65000, ETH: 3400, USDT: 1 };
  let total = 0;
  wallRoute.balances.forEach(b => {
    const price = prices[b.asset] || 1;
    b.value = (b.free + b.locked) * price;
    total += b.value;
  });
  wallRoute.totalValueUSD = total;
  await wallRoute.save();
  res.json(wallRoute.balances);
});

router.post('/deposit', authMiddleware, async (req, res) => {
  const { asset, amount } = req.body;
  const wallRoute = await Wallet.findOne({ userId: req.user.userId });
  const balance = wallRoute.balances.find(b => b.asset === asset);
  if (balance) balance.free += amount;
  else wallRoute.balances.push({ asset, free: amount, locked: 0 });
  await wallRoute.save();
  const tx = new Transaction({ userId: req.user.userId, type: 'deposit', asset, amount, status: 'completed', completedAt: new Date() });
  await tx.save();
  res.json({ message: 'Deposit successful', transaction: tx, address: '0xMockAddress123' });
});

router.post('/withdraw', authMiddleware, async (req, res) => {
  const { asset, amount, address } = req.body;
  const wallRoute = await Wallet.findOne({ userId: req.user.userId });
  const balance = wallRoute.balances.find(b => b.asset === asset);
  if (!balance || balance.free < amount) return res.status(400).json({ message: 'Insufficient balance' });
  balance.free -= amount;
  await wallRoute.save();
  const tx = new Transaction({ userId: req.user.userId, type: 'withdrawal', asset, amount, status: 'completed', metadata: { address }, completedAt: new Date() });
  await tx.save();
  res.json({ message: 'Withdrawal submitted', transaction: tx });
});

module.exports = router;