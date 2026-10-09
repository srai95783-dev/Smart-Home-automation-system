import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, LogOut, ExternalLink, ShieldCheck, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-navbar">
      <Link to={isAdmin ? '/admin/dashboard' : '/homeowner/dashboard'} className="brand-badge">
        <div className="brand-logo-icon">
          <Home size={20} />
        </div>
        <span>SmartHome<span style={{ color: 'var(--primary)', fontSize: '0.85em' }}>OS</span></span>
      </Link>

      <div className="navbar-user-actions">
        {/* Quick link to live Swagger UI for viva examiners */}
        <a
          href="http://localhost:8080/swagger-ui/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
          style={{ gap: '0.4rem', color: '#93c5fd' }}
          title="Open Swagger REST API interactive tester"
        >
          <ExternalLink size={14} />
          <span>Swagger API Docs</span>
        </a>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`role-pill ${isAdmin ? 'admin' : 'homeowner'}`}>
              {isAdmin ? 'System Admin' : 'Homeowner'}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.fullName}</span>
          </div>
        )}

        <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log Out">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
