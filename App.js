import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import Navbar from './Navbar';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import TradeBox from './TradeBox';
import Wallet from './Wallet';
import History from './History';
import Profile from './Profile';
import Admin from './Admin';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/trade" element={<PrivateRoute><TradeBox /></PrivateRoute>} />
                <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
                <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;