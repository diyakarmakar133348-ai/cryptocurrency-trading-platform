const express = require('express');
const User = require('./User');
const Wallet = require('./Wallet');
const { generateToken } = require('./jwt');
const { registerValidation, loginValidation } = require('./validation');
const { authMiddleware } = require('./authMiddleware');
const { authLimiter } = require('./rateLimit');

const router = express.Router();

router.post('/register', registerValidation, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = new User({ username, email, password });
    await user.save();
    const wallet = new Wallet({ userId: user._id, balances: [{ asset: 'USDT', free: 10000, locked: 0 }], totalValueUSD: 10000 });
    await wallet.save();
    const token = generateToken(user);
    res.status(201).json({ user: { id: user._id, username, email, role: user.role }, token });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/login', authLimiter, loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user);
    res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role }, token });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

router.put('/profile', authMiddleware, async (req, res) => {
  const allowed = ['fullName', 'phone', 'address'];
  const updates = {};
  for (let key of allowed) if (req.body[key]) updates[key] = req.body[key];
  const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');
  res.json(user);
});

module.exports = router;