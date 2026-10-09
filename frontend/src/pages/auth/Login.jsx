import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, ShieldCheck, UserCheck, KeyRound, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/homeowner/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentialsAndLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const user = await login(demoEmail, demoPassword);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/homeowner/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%)' }}>
      <div style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Home size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>SmartHome Platform</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Online Home Automation Control & Monitoring
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center', fontWeight: 500 }}>
            QUICK DEMO ACCESS (CLICK TO LOG IN)
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => fillCredentialsAndLogin('admin@homeauto.com', 'admin123')}
              className="btn btn-outline"
              style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', borderColor: '#ef4444', color: '#fca5a5' }}
            >
              <ShieldCheck size={14} />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentialsAndLogin('john@homeauto.com', 'john123')}
              className="btn btn-outline"
              style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', borderColor: '#3b82f6', color: '#93c5fd' }}
            >
              <UserCheck size={14} />
              <span>Homeowner</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="e.g. user@homeauto.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
          >
            <KeyRound size={18} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register as Homeowner
          </Link>
        </div>
      </div>
    </div>
  );
};
