import React, { useState, useEffect } from 'react';
import api from './api';
import './History.css';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [trades, setTrades] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [ordersRes, tradesRes] = await Promise.all([
        api.get('/orders/history'),
        api.get('/trades/history')
      ]);
      setOrders(ordersRes.data);
      setTrades(tradesRes.data);
    } catch (error) {
      // Mock data
      setOrders([
        { id: 1, symbol: 'BTC/USDT', type: 'limit', side: 'buy', price: 27000, amount: 0.1, status: 'filled', createdAt: '2024-01-15T10:30:00Z' },
        { id: 2, symbol: 'ETH/USDT', type: 'market', side: 'sell', price: 1650, amount: 1.5, status: 'filled', createdAt: '2024-01-14T15:20:00Z' }
      ]);
      setTrades([
        { id: 1, symbol: 'BTC/USDT', side: 'buy', price: 27000, amount: 0.1, fee: 2.7, timestamp: '2024-01-15T10:30:00Z' },
        { id: 2, symbol: 'ETH/USDT', side: 'sell', price: 1650, amount: 1.5, fee: 2.48, timestamp: '2024-01-14T15:20:00Z' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="history-container">
      <h1>Trading History</h1>
      
      <div className="tabs">
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'trades' ? 'active' : ''}
          onClick={() => setActiveTab('trades')}
        >
          Trades
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="orders-section card">
          <h2>Order History</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.symbol}</td>
                    <td>{order.type}</td>
                    <td className={order.side === 'buy' ? 'positive' : 'negative'}>
                      {order.side.toUpperCase()}
                    </td>
                    <td>${order.price.toLocaleString()}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`badge-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'trades' && (
        <div className="trades-section card">
          <h2>Trade History</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Total</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td>{new Date(trade.timestamp).toLocaleString()}</td>
                    <td>{trade.symbol}</td>
                    <td className={trade.side === 'buy' ? 'positive' : 'negative'}>
                      {trade.side.toUpperCase()}
                    </td>
                    <td>${trade.price.toLocaleString()}</td>
                    <td>{trade.amount}</td>
                    <td>${(trade.price * trade.amount).toLocaleString()}</td>
                    <td>${trade.fee.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;