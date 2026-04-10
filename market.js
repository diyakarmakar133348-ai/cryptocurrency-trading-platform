const express = require('express');
const router = express.Router();

router.get('/top', (req, res) => {
  res.json([
    { symbol: 'BTC/USDT', price: 65432.10, change24h: 2.3, volume: 1250000 },
    { symbol: 'ETH/USDT', price: 3456.78, change24h: 1.5, volume: 800000 },
    { symbol: 'BNB/USDT', price: 567.89, change24h: -0.5, volume: 300000 }
  ]);
});

router.get('/price/:symbol', (req, res) => {
  const sym = req.params.symbol;
  let price = 0;
  if (sym === 'BTCUSDT') price = 65432.10;
  else if (sym === 'ETHUSDT') price = 3456.78;
  else if (sym === 'BNBUSDT') price = 567.89;
  else price = 100;
  res.json({ price });
});

router.get('/orderbook/:symbol', (req, res) => {
  res.json({ bids: [[65400,1.2],[65380,2.5]], asks: [[65450,1.1],[65480,2.2]] });
});

router.get('/chart/:symbol', (req, res) => {
  const data = [];
  let base = 65000;
  for (let i = 0; i < 100; i++) {
    base += (Math.random() - 0.5) * 200;
    data.push({
      time: Date.now() / 1000 - (100 - i) * 3600,
      open: base,
      high: base + Math.random() * 50,
      low: base - Math.random() * 50,
      close: base + (Math.random() - 0.5) * 30
    });
  }
  res.json(data);
});

// Portfolio endpoint used by Dashboard
router.get('/portfolio', (req, res) => {
  // In a real app, fetch from wallet and calculate. For mock:
  res.json({ totalValue: 12543.67, change24h: 8.5, assets: [
    { symbol: 'BTC', amount: 0.45, value: 12543.67, change24h: 5.2 },
    { symbol: 'ETH', amount: 3.2, value: 5432.10, change24h: 3.8 }
  ]});
});

module.exports = router;