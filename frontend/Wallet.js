import React, { useState, useEffect } from 'react';
import api from './api';
import './Wallet.css';

const Wallet = () => {
  const [balances, setBalances] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [depositAddress, setDepositAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await api.get('/wallet/balances');
      setBalances(response.data);
    } catch (error) {
      // Mock data
      setBalances([
        { asset: 'BTC', free: 0.45, locked: 0, total: 0.45, value: 12543.67 },
        { asset: 'ETH', free: 3.2, locked: 0, total: 3.2, value: 5432.10 },
        { asset: 'USDT', free: 5000, locked: 0, total: 5000, value: 5000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (asset) => {
    try {
      const response = await api.post(`/wallet/deposit/${asset}`);
      setDepositAddress(response.data.address);
      setSelectedAsset(asset);
    } catch (error) {
      alert('Failed to generate deposit address');
    }
  };

  const handleWithdraw = async (asset) => {
    if (!withdrawAmount || !withdrawAddress) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await api.post(`/wallet/withdraw/${asset}`, {
        amount: withdrawAmount,
        address: withdrawAddress
      });
      alert('Withdrawal request submitted');
      setWithdrawAmount('');
      setWithdrawAddress('');
      fetchWalletData();
    } catch (error) {
      alert('Failed to process withdrawal');
    }
  };

  if (loading) return <div className="loading">Loading wallet...</div>;

  return (
    <div className="wallet-container">
      <h1>Wallet Management</h1>
      
      <div className="balances-section card">
        <h2>Your Balances</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Available</th>
                <th>Locked</th>
                <th>Total</th>
                <th>Value (USD)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance) => (
                <tr key={balance.asset}>
                  <td><strong>{balance.asset}</strong></td>
                  <td>{balance.free.toFixed(8)}</td>
                  <td>{balance.locked.toFixed(8)}</td>
                  <td>{balance.total.toFixed(8)}</td>
                  <td>${balance.value.toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleDeposit(balance.asset)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Deposit
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setSelectedAsset(balance.asset)}
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAsset && (
        <div className="modal">
          <div className="modal-content card">
            <h3>{selectedAsset} Transaction</h3>
            <button className="close-btn" onClick={() => setSelectedAsset(null)}>×</button>
            
            {depositAddress && (
              <div className="deposit-section">
                <h4>Deposit Address</h4>
                <div className="address">{depositAddress}</div>
                <button
                  className="btn-secondary"
                  onClick={() => navigator.clipboard.writeText(depositAddress)}
                >
                  Copy Address
                </button>
              </div>
            )}
            
            <div className="withdraw-section">
              <h4>Withdraw {selectedAsset}</h4>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.001"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Withdrawal Address</label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>
              <button
                className="btn-primary"
                onClick={() => handleWithdraw(selectedAsset)}
              >
                Submit Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;