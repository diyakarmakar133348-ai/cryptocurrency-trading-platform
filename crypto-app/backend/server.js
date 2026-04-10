require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('./rateLimit');
const authRoutes = require('./auth');
const walletRoutes = require('./walletRoute');
const tradingRoutes = require('./trading');
const marketRoutes = require('./market');
const adminRoutes = require('./admin');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api', rateLimit.globalLimiter);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api', tradingRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));