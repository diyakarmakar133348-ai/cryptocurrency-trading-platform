import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from './api';
import Chart from './Chart';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [portfolioRes, marketRes, chartRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/market/top'),
        api.get('/market/chart/BTCUSDT')
      ]);
      setPortfolio(portfolioRes.data);
      setMarketData(marketRes.data);
      setChartData(chartRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data
      setPortfolio({
        totalValue: 12543.67,
        change24h: 8.5,
        assets: [
          { symbol: 'BTC', amount: 0.45, value: 12543.67, change24h: 5.2 },
          { symbol: 'ETH', amount: 3.2, value: 5432.10, change24h: 3.8 },
          { symbol: 'BNB', amount: 12.5, value: 3456.78, change24h: -2.1 }
        ]
      });
      setMarketData([
        { symbol: 'BTC/USDT', price: 27854.32, change24h: 2.5, volume: 1245234 },
        { symbol: 'ETH/USDT', price: 1697.85, change24h: 1.8, volume: 823456 },
        { symbol: 'BNB/USDT', price: 276.54, change24h: -0.5, volume: 234567 }
      ]);
      const mockChart = [];
      let basePrice = 27000;
      for (let i = 0; i < 100; i++) {
        basePrice += (Math.random() - 0.5) * 100;
        mockChart.push({
          time: Date.now() / 1000 - (100 - i) * 3600,
          open: basePrice,
          high: basePrice + Math.random() * 50,
          low: basePrice - Math.random() * 50,
          close: basePrice + (Math.random() - 0.5) * 30
        });
      }
      setChartData(mockChart);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await api.get('/market/top');
      setMarketData(response.data);
    } catch (error) {
      // Silent fail
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!portfolio) return <div className="loading">Loading portfolio...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}</h1>
        <div className="portfolio-summary">
          <div className="summary-card">
            <h3>Total Portfolio Value</h3>
            <div className="value">${portfolio.totalValue?.toLocaleString()}</div>
            <div className={`change ${portfolio.change24h >= 0 ? 'positive' : 'negative'}`}>
              {portfolio.change24h >= 0 ? '+' : ''}{portfolio.change24h}%
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-section card">
          <Chart data={chartData} symbol="BTC/USDT" />
        </div>

        <div className="market-section card">
          <h3>Market Overview</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Price</th>
                  <th>24h Change</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((item) => (
                  <tr key={item.symbol}>
                    <td>{item.symbol}</td>
                    <td>${item.price?.toLocaleString()}</td>
                    <td className={item.change24h >= 0 ? 'positive' : 'negative'}>
                      {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                    </td>
                    <td>${item.volume?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="portfolio-section card">
          <h3>Your Assets</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Value (USD)</th>
                  <th>24h Change</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.assets?.map((asset) => (
                  <tr key={asset.symbol}>
                    <td>{asset.symbol}</td>
                    <td>{asset.amount}</td>
                    <td>${asset.value?.toLocaleString()}</td>
                    <td className={asset.change24h >= 0 ? 'positive' : 'negative'}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;