import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Mock user retrieval
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // fallback mock user
        setUser({ id: 1, username: 'demo_user', email: 'user@example.com', role: 'user' });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
  const mockUser = {
    id: 1,
    username: email.includes('admin') ? 'admin' : 'demo_user',
    email: email,
    role: 'admin' // <-- force admin for testing
  };
  const mockToken = 'mock-jwt-token';
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  setUser(mockUser);
  return { user: mockUser, token: mockToken };
};

  const register = async (userData) => {
    // Mock register
    const mockUser = {
      id: 1,
      username: userData.username,
      email: userData.email,
      role: 'user'
    };
    const mockToken = 'mock-jwt-token';
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return { user: mockUser, token: mockToken };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};