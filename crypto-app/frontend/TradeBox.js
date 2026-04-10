import React, { useState, useEffect, useCallback } from 'react';
import api from './api';
import Chart from './Chart';
import './TradeBox.css';

const TradeBox = () => {
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState('limit');
  const [side, setSide] = useState('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [balance] = useState({ BTC: 0, USDT: 10000 });
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'];

  const fetchMarketData = useCallback(async () => {
    try {
      const [priceRes, chartRes, orderBookRes] = await Promise.all([
        api.get(`/market/price/${symbol.replace('/', '')}`),
        api.get(`/market/chart/${symbol.replace('/', '')}`),
        api.get(`/market/orderbook/${symbol.replace('/', '')}`)
      ]);
      setCurrentPrice(priceRes.data.price);
      setChartData(chartRes.data);
      setOrderBook(orderBookRes.data);
    } catch (error) {
      // Mock data
      setCurrentPrice(27854.32);
      setChartData(generateMockChartData());
      setOrderBook({
        bids: [[27850, 1.5], [27840, 2.0], [27830, 1.2]],
        asks: [[27860, 1.3], [27870, 1.8], [27880, 2.1]]
      });
    }
  }, [symbol]);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 1000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const generateMockChartData = () => {
    const data = [];
    let basePrice = 27000;
    for (let i = 0; i < 100; i++) {
      basePrice += (Math.random() - 0.5) * 100;
      data.push({
        time: Date.now() / 1000 - (100 - i) * 3600,
        open: basePrice,
        high: basePrice + Math.random() * 50,
        low: basePrice - Math.random() * 50,
        close: basePrice + (Math.random() - 0.5) * 30
      });
    }
    return data;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const order = {
      symbol,
      type: orderType,
      side,
      price: orderType === 'market' ? null : parseFloat(price),
      amount: parseFloat(amount),
      stopPrice: orderType === 'stop-loss' ? parseFloat(stopPrice) : null
    };

    try {
      await api.post('/orders', order);
      alert('Order placed successfully!');
      setAmount('');
      setPrice('');
      setStopPrice('');
    } catch (error) {
      alert('Failed to place order');
    }
  };

  const calculateTotal = () => {
    if (orderType === 'market') {
      return (parseFloat(amount) * currentPrice).toFixed(2);
    }
    return (parseFloat(amount) * parseFloat(price || 0)).toFixed(2);
  };

  return (
    <div className="trade-container">
      <div className="trade-header">
        <h1>Spot Trading</h1>
        <div className="symbol-selector">
          {symbols.map(s => (
            <button
              key={s}
              className={symbol === s ? 'active' : ''}
              onClick={() => setSymbol(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="trade-grid">
        <div className="chart-section card">
          <Chart data={chartData} symbol={symbol} />
          <div className="order-book">
            <h3>Order Book</h3>
            <div className="order-book-grid">
              <div className="bids">
                <h4>Bids</h4>
                {orderBook.bids.slice(0, 10).map((bid, i) => (
                  <div key={i} className="order-row">
                    <span className="price">{bid[0]}</span>
                    <span className="amount">{bid[1]}</span>
                  </div>
                ))}
              </div>
              <div className="asks">
                <h4>Asks</h4>
                {orderBook.asks.slice(0, 10).map((ask, i) => (
                  <div key={i} className="order-row">
                    <span className="price">{ask[0]}</span>
                    <span className="amount">{ask[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="trade-form card">
          <div className="current-price">
            <span className="label">Current Price:</span>
            <span className="value">${currentPrice.toLocaleString()}</span>
          </div>

          <div className="balance-info">
            <div>Available Balance:</div>
            <div>BTC: {balance.BTC} | USDT: {balance.USDT}</div>
          </div>

          <div className="side-selector">
            <button
              className={side === 'buy' ? 'active buy' : ''}
              onClick={() => setSide('buy')}
            >
              Buy
            </button>
            <button
              className={side === 'sell' ? 'active sell' : ''}
              onClick={() => setSide('sell')}
            >
              Sell
            </button>
          </div>

          <form onSubmit={handleSubmitOrder}>
            <div className="form-group">
              <label>Order Type</label>
              <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="limit">Limit</option>
                <option value="market">Market</option>
                <option value="stop-loss">Stop Loss</option>
              </select>
            </div>

            {orderType !== 'market' && (
              <div className="form-group">
                <label>Price (USDT)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required={orderType !== 'market'}
                />
              </div>
            )}

            <div className="form-group">
              <label>Amount ({symbol.split('/')[0]})</label>
              <input
                type="number"
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {orderType === 'stop-loss' && (
              <div className="form-group">
                <label>Stop Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="order-summary">
              <div>Total: ${calculateTotal()}</div>
              <div>Fee: ${(calculateTotal() * 0.001).toFixed(2)}</div>
            </div>

            <button
              type="submit"
              className={`btn-primary ${side}`}
              disabled={!amount}
            >
              {side === 'buy' ? 'Buy' : 'Sell'} {symbol.split('/')[0]}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeBox;