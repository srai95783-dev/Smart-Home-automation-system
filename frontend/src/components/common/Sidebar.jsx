import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Cpu,
  Zap,
  Thermometer,
  ShieldCheck,
  Activity,
  User,
  Users,
  CheckSquare,
  Bell,
  Settings,
} from 'lucide-react';

export const Sidebar = () => {
  const { isAdmin } = useAuth();

  const homeownerLinks = [
    { to: '/homeowner/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/homeowner/devices', label: 'Device Control', icon: <Cpu size={18} /> },
    { to: '/homeowner/automations', label: 'Automation Rules', icon: <Zap size={18} /> },
    { to: '/homeowner/environment', label: 'Environment Sensors', icon: <Thermometer size={18} /> },
    { to: '/homeowner/security', label: 'Security Center', icon: <ShieldCheck size={18} /> },
    { to: '/homeowner/energy', label: 'Energy Analytics', icon: <Activity size={18} /> },
    { to: '/homeowner/profile', label: 'My Profile', icon: <User size={18} /> },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'System Overview', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/users', label: 'User Management', icon: <Users size={18} /> },
    { to: '/admin/devices', label: 'Device Compatibility', icon: <CheckSquare size={18} /> },
    { to: '/admin/alerts', label: 'System Alerts & Logs', icon: <Bell size={18} /> },
    { to: '/admin/settings', label: 'Global Settings', icon: <Settings size={18} /> },
  ];

  const links = isAdmin ? adminLinks : homeownerLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isAdmin ? 'Administration Portal' : 'Smart Home Control'}
        </span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <p>Home Automation v1.0</p>
          <p>Online & Active</p>
        </div>
      </div>
    </aside>
  );
};
