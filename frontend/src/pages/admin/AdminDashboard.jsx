import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import {
  Users,
  Cpu,
  Server,
  Activity,
  AlertTriangle,
  RefreshCw,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [metricsRes, alertsRes] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getAlerts(),
      ]);

      if (metricsRes.success) setMetrics(metricsRes.data);
      if (alertsRes.success) setAlerts(alertsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="page-wrapper"><p>Gathering system telemetry...</p></div>;
  }

  const formatUptime = (totalSeconds) => {
    if (!totalSeconds) return '0s';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Administration & Monitoring</h1>
          <p className="page-subtitle">Real-time health, server performance, and user activity overview</p>
        </div>
        <button onClick={loadData} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={14} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top System Health Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-val">{metrics?.totalUsers ?? 0}</div>
            <div className="stat-label">Total Registered Users</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {metrics?.homeownerCount} Homeowners, {metrics?.adminCount} Admin
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)' }}>
            <Cpu size={26} />
          </div>
          <div>
            <div className="stat-val">{metrics?.totalDevices ?? 0}</div>
            <div className="stat-label">Managed Smart Devices</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
              {metrics?.onlineDevices} Online, {metrics?.activePoweredDevices} Powered ON
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <Activity size={26} />
          </div>
          <div>
            <div className="stat-val" style={{ color: 'var(--success)' }}>{metrics?.systemHealth ?? 'HEALTHY'}</div>
            <div className="stat-label">Platform Core Status</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REST APIs Operational</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Server size={26} />
          </div>
          <div>
            <div className="stat-val">{metrics?.jvmUsedMemoryMb ?? 0} MB</div>
            <div className="stat-label">JVM Heap Memory in Use</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Allocated: {metrics?.jvmTotalMemoryMb} MB
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Management Portals</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Users size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>User Management</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                View all registered users, create administrators or homeowners, toggle active status, and modify user roles.
              </p>
              <Link to="/admin/users" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
                Open Users Table →
              </Link>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)' }}>
                  <Layers size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Device Compatibility</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Approve or reject hardware models, add new IoT specifications, and control which devices can be installed.
              </p>
              <Link to="/admin/devices" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
                Manage Compatibility →
              </Link>
            </div>

          </div>

          {/* Server Uptime & Specs Box */}
          <div className="card" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Clock size={24} color="#94a3b8" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Backend Server Uptime</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Java Spring Boot Web Application</p>
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60a5fa' }}>
              {formatUptime(metrics?.uptimeSeconds)}
            </div>
          </div>
        </div>

        {/* System Alerts Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} color="var(--warning)" />
              <span>System Event Stream</span>
            </h2>
            <Link to="/admin/alerts" style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none' }}>
              All Alerts →
            </Link>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', padding: '1rem', textAlign: 'center' }}>No system alerts.</p>
            ) : (
              alerts.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `4px solid ${
                      alert.severity === 'CRITICAL' ? 'var(--danger)' : alert.severity === 'WARNING' ? 'var(--warning)' : 'var(--primary)'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{alert.alertType}</span>
                    <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
