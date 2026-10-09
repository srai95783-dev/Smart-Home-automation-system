import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Home, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'HOMEOWNER',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await authApi.register(formData);
      if (res.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%)' }}>
      <div style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Home size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Join SmartHome</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Create your Homeowner account to control your smart home
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              className="form-input"
              placeholder="e.g. Alice Johnson"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="form-input"
              placeholder="alice@homeauto.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (at least 6 characters)</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="text"
              name="phone"
              className="form-input"
              placeholder="+1-555-0199"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
