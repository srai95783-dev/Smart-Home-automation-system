import React, { useState, useEffect } from 'react';
import { homeownerApi } from '../../api/homeownerApi';
import { DeviceCard } from '../../components/devices/DeviceCard';
import {
  Cpu,
  Zap,
  Thermometer,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomeDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [security, setSecurity] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [devRes, telRes, secRes, alertRes] = await Promise.all([
        homeownerApi.getDevices(),
        homeownerApi.getEnvironment(),
        homeownerApi.getSecurity(),
        homeownerApi.getAlerts(),
      ]);

      if (devRes.success) setDevices(devRes.data || []);
      if (telRes.success) setTelemetry(telRes.data);
      if (secRes.success) setSecurity(secRes.data);
      if (alertRes.success) setAlerts(alertRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto refresh every 15 seconds to catch simulation updates
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePower = async (id, powerState) => {
    try {
      const res = await homeownerApi.togglePower(id, powerState);
      if (res.success) {
        setDevices((prev) => prev.map((d) => (d.id === id ? res.data : d)));
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle power');
    }
  };

  const handleUpdateSetting = async (id, settingValue) => {
    try {
      const res = await homeownerApi.updateSettings(id, settingValue);
      if (res.success) {
        setDevices((prev) => prev.map((d) => (d.id === id ? res.data : d)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update setting');
    }
  };

  const handleDeleteDevice = async (id) => {
    if (!window.confirm('Are you sure you want to remove this device?')) return;
    try {
      await homeownerApi.deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete device');
    }
  };

  const activeCount = devices.filter((d) => d.powerState === 'ON').length;

  if (loading) {
    return <div className="page-wrapper"><p>Loading smart home telemetry...</p></div>;
  }

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Smart Home Dashboard</h1>
          <p className="page-subtitle">Real-time status, environmental telemetry, and quick device control</p>
        </div>
        <button onClick={loadData} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={14} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Cpu size={24} />
          </div>
          <div>
            <div className="stat-val">{devices.length}</div>
            <div className="stat-label">Connected Devices ({activeCount} Active)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)' }}>
            <Thermometer size={24} />
          </div>
          <div>
            <div className="stat-val">{telemetry?.currentTemperature ?? 24.5}°C</div>
            <div className="stat-label">Living Room Temp (Live Sensor)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Droplets size={24} />
          </div>
          <div>
            <div className="stat-val">{telemetry?.currentHumidity ?? 54}%</div>
            <div className="stat-label">Room Humidity (Simulated)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: security?.overallStatus === 'ALERT' ? '#f87171' : 'var(--success)' }}>
              {security?.overallStatus ?? 'SECURED'}
            </div>
            <div className="stat-label">{security?.activeArmedDevices ?? 1} Lock(s) Armed</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Devices + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Device Controls Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Quick Controls</h2>
            <Link to="/homeowner/devices" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
              View All Devices ({devices.length}) →
            </Link>
          </div>

          {devices.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No devices registered yet.</p>
              <Link to="/homeowner/devices" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                Add Your First Device
              </Link>
            </div>
          ) : (
            <div className="device-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {devices.slice(0, 4).map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onTogglePower={handleTogglePower}
                  onUpdateSetting={handleUpdateSetting}
                  onDelete={handleDeleteDevice}
                />
              ))}
            </div>
          )}
        </div>

        {/* Security & System Alerts Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} color="var(--warning)" />
              <span>Activity & Alerts</span>
            </h2>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                No active security alerts.
              </p>
            ) : (
              alerts.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `4px solid ${
                      alert.severity === 'CRITICAL' ? 'var(--danger)' : alert.severity === 'WARNING' ? 'var(--warning)' : 'var(--primary)'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: alert.severity === 'CRITICAL' ? '#f87171' : '#94a3b8' }}>
                      {alert.alertType}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
