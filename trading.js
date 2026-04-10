const express = require('express');
const Order = require('./Order');
const Trade = require('./Trade');
const { authMiddleware } = require('./authMiddleware');

const router = express.Router();

router.post('/orders', authMiddleware, async (req, res) => {
  const { symbol, type, side, price, amount } = req.body;
  const order = new Order({
    userId: req.user.userId, symbol, type, side, price: price || 0, amount, status: 'filled'
  });
  await order.save();
  const trade = new Trade({
    orderId: order._id, userId: req.user.userId, symbol, side, price: 65000, amount,
    total: amount * 65000, fee: amount * 65000 * 0.001
  });
  await trade.save();
  res.status(201).json(order);
});

router.get('/orders/history', authMiddleware, async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/trades/history', authMiddleware, async (req, res) => {
  const trades = await Trade.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(trades);
});

module.exports = router;