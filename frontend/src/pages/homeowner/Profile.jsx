import React, { useState, useEffect } from 'react';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { User, KeyRound, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        newPassword: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await authApi.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        newPassword: formData.newPassword.trim() ? formData.newPassword : null,
      });

      if (res.success && res.data) {
        setMessage('Profile updated successfully!');
        updateUserProfile(res.data);
        setFormData((prev) => ({ ...prev, newPassword: '' }));
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '650px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Account Profile</h1>
          <p className="page-subtitle">Manage your personal information and account credentials</p>
        </div>
      </div>

      <div className="card">
        {message && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <CheckCircle size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read Only)</label>
            <input
              type="email"
              disabled
              className="form-input"
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
              value={formData.email}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="+1-555-0100"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div style={{ margin: '1.5rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Change Password</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Leave blank if you do not want to modify your current password.
            </p>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter at least 6 characters"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
            <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
