import React, { useState, useEffect } from 'react';
import api from './api';
import './Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolume: 0,
    activeOrders: 0,
    pendingKYC: 0
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, transactionsRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/transactions'),
        api.get('/admin/stats')
      ]);
      setUsers(usersRes.data);
      setTransactions(transactionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      // Mock data
      setUsers([
        { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user', kycStatus: 'verified', balance: 12543.67, createdAt: '2024-01-01' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user', kycStatus: 'pending', balance: 5432.10, createdAt: '2024-01-05' }
      ]);
      setTransactions([
        { id: 1, userId: 1, type: 'deposit', amount: 5000, status: 'completed', timestamp: '2024-01-10T10:30:00Z' },
        { id: 2, userId: 2, type: 'trade', amount: 2700, status: 'completed', timestamp: '2024-01-11T15:20:00Z' }
      ]);
      setStats({
        totalUsers: 1250,
        totalVolume: 3456789,
        activeOrders: 342,
        pendingKYC: 45
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchAdminData();
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  const handleApproveKYC = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/kyc/approve`);
      fetchAdminData();
    } catch (error) {
      alert('Failed to approve KYC');
    }
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h3>Total Volume</h3>
          <div className="stat-value">${stats.totalVolume.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h3>Active Orders</h3>
          <div className="stat-value">{stats.activeOrders}</div>
        </div>
        <div className="stat-card">
          <h3>Pending KYC</h3>
          <div className="stat-value">{stats.pendingKYC}</div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="users-section card">
          <h2>User Management</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>KYC Status</th>
                  <th>Balance</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge-${user.kycStatus}`}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td>${user.balance.toLocaleString()}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.kycStatus === 'pending' && (
                        <button
                          className="btn-secondary"
                          onClick={() => handleApproveKYC(user.id)}
                        >
                          Approve KYC
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="transactions-section card">
          <h2>Transaction Monitoring</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.id}</td>
                    <td>{tx.userId}</td>
                    <td>{tx.type}</td>
                    <td>${tx.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge-${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{new Date(tx.timestamp).toLocaleString()}</td>
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

export default Admin;