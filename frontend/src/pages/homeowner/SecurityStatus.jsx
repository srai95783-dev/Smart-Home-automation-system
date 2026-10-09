import React, { useState, useEffect } from 'react';
import { homeownerApi } from '../../api/homeownerApi';
import { ShieldCheck, ShieldAlert, Lock, Unlock, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

export const SecurityStatus = () => {
  const [security, setSecurity] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [secRes, devRes] = await Promise.all([
        homeownerApi.getSecurity(),
        homeownerApi.getDevices(),
      ]);
      if (secRes.success) setSecurity(secRes.data);
      if (devRes.success) {
        // Filter only security-related devices (locks, cameras, detectors)
        const secDevices = (devRes.data || []).filter(
          (d) => d.category === 'SECURITY' || d.category === 'SENSOR'
        );
        setDevices(secDevices);
      }
    } catch (err) {
      console.error('Failed to load security status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleLock = async (id, currentPower) => {
    const nextPower = currentPower === 'ON' ? 'OFF' : 'ON';
    try {
      const res = await homeownerApi.togglePower(id, nextPower);
      if (res.success) {
        setDevices((prev) => prev.map((d) => (d.id === id ? res.data : d)));
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle lock');
    }
  };

  if (loading) {
    return <div className="page-wrapper"><p>Analyzing security perimeter...</p></div>;
  }

  const isSecured = security?.overallStatus === 'SECURED';

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Security Center</h1>
          <p className="page-subtitle">Real-time status of smart locks, entry sensors, and security intrusion alerts</p>
        </div>
      </div>

      {/* Main Security Status Banner */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          borderLeft: `6px solid ${isSecured ? 'var(--success)' : 'var(--danger)'}`,
          background: isSecured
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 1) 100%)'
            : 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(30, 41, 59, 1) 100%)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isSecured ? 'var(--success-light)' : 'var(--danger-light)',
            color: isSecured ? 'var(--success)' : 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSecured ? <ShieldCheck size={36} /> : <ShieldAlert size={36} />}
        </div>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: isSecured ? '#34d399' : '#f87171' }}>
            {isSecured ? 'System Armed & Perimeter Secured' : 'Security Warning: Attention Required'}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            {security?.activeArmedDevices ?? 0} out of {security?.totalSecurityDevices ?? 0} security units currently engaged.
          </p>
        </div>
      </div>

      {/* Security Devices List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Smart Locks & Access Control
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {devices.map((device) => {
              const isLocked = device.powerState === 'ON';
              return (
                <div
                  key={device.id}
                  className="card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isLocked ? 'var(--success-light)' : 'var(--warning-light)',
                        color: isLocked ? 'var(--success)' : 'var(--warning)',
                      }}
                    >
                      {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{device.customName}</h4>
                      <span className="device-room-pill">{device.roomLocation}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleLock(device.id, device.powerState)}
                    className={`btn btn-sm ${isLocked ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      backgroundColor: isLocked ? '#10b981' : 'transparent',
                      borderColor: isLocked ? '#10b981' : 'var(--border-color)',
                      gap: '0.4rem',
                    }}
                  >
                    {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    <span>{isLocked ? 'Locked (Secure)' : 'Unlocked'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Logs */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--warning)" />
            <span>Security Activity Feed</span>
          </h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {security?.recentSecurityAlerts?.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', padding: '1rem', textAlign: 'center' }}>
                No recent security incidents logged.
              </p>
            ) : (
              security?.recentSecurityAlerts?.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: '4px solid var(--primary)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600, color: '#60a5fa' }}>{alert.alertType}</span>
                    <span>{new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{alert.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
