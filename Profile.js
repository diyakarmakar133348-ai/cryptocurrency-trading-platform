import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from './api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [kycDocuments, setKycDocuments] = useState({
    idDocument: null,
    proofOfAddress: null
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const [profileRes, kycRes] = await Promise.all([
        api.get('/profile'),
        api.get('/kyc/status')
      ]);
      setProfile(profileRes.data);
      setKycStatus(kycRes.data);
    } catch (error) {
      // Mock data
      setProfile({
        username: user?.username,
        email: user?.email,
        fullName: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        twoFactorEnabled: false
      });
      setKycStatus({
        status: 'pending',
        level: 1,
        submittedAt: '2024-01-10'
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put('/profile', profile);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('idDocument', kycDocuments.idDocument);
    formData.append('proofOfAddress', kycDocuments.proofOfAddress);
    
    try {
      await api.post('/kyc/submit', formData);
      alert('KYC documents submitted successfully');
      fetchProfile();
    } catch (error) {
      alert('Failed to submit KYC documents');
    }
  };

  const handleFileChange = (e, type) => {
    setKycDocuments({
      ...kycDocuments,
      [type]: e.target.files[0]
    });
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <h1>Account Settings</h1>
      
      <div className="profile-grid">
        <div className="profile-section card">
          <h2>Personal Information</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value})}
                disabled
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                rows="3"
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={updating}>
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="security-section card">
          <h2>Security</h2>
          
          <div className="security-item">
            <div>
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>
            <button className="btn-secondary">
              {profile.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
          
          <div className="security-item">
            <div>
              <h3>Change Password</h3>
              <p>Update your password regularly</p>
            </div>
            <button className="btn-secondary">Change</button>
          </div>
          
          <div className="security-item">
            <div>
              <h3>API Keys</h3>
              <p>Manage your API access keys</p>
            </div>
            <button className="btn-secondary">Manage</button>
          </div>
        </div>

        <div className="kyc-section card">
          <h2>KYC Verification</h2>
          <div className="kyc-status">
            <div className="status-badge">
              Status: <span className={`badge-${kycStatus.status}`}>
                {kycStatus.status.toUpperCase()}
              </span>
            </div>
            {kycStatus.level && (
              <div>Verification Level: {kycStatus.level}</div>
            )}
          </div>
          
          {kycStatus.status === 'pending' && (
            <form onSubmit={handleKYCSubmit}>
              <div className="form-group">
                <label>ID Document (Passport/Driver's License)</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'idDocument')}
                  accept="image/*,.pdf"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Proof of Address (Utility Bill/Bank Statement)</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                  accept="image/*,.pdf"
                  required
                />
              </div>
              
              <button type="submit" className="btn-primary">
                Submit KYC Documents
              </button>
            </form>
          )}
          
          {kycStatus.status === 'verified' && (
            <div className="verified-message">
              ✓ Your identity has been verified
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;