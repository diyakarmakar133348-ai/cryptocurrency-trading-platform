import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">₿</span>
          CryptoTrader
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/trade" className="nav-link">Trade</Link>
          <Link to="/wallet" className="nav-link">Wallet</Link>
          <Link to="/history" className="nav-link">History</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
        </div>

        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;