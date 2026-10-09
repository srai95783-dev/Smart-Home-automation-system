import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Bell, AlertTriangle, AlertCircle, Info, RefreshCw } from 'lucide-react';

export const SystemAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const res = await adminApi.getAlerts();
      if (res.success) {
        setAlerts(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const severities = ['ALL', 'INFO', 'WARNING', 'CRITICAL'];

  const filteredAlerts =
    filterSeverity === 'ALL'
      ? alerts
      : alerts.filter((a) => a.severity?.toUpperCase() === filterSeverity.toUpperCase());

  const getSeverityIcon = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return <AlertCircle size={20} color="#ef4444" />;
      case 'WARNING':
        return <AlertTriangle size={20} color="#f59e0b" />;
      default:
        return <Info size={20} color="#3b82f6" />;
    }
  };

  if (loading) {
    return <div className="page-wrapper"><p>Querying system audit log stream...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Monitoring & Alerts</h1>
          <p className="page-subtitle">Platform audit logs, security alerts, and system health status</p>
        </div>
        <button onClick={loadAlerts} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={14} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar">
        {severities.map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`filter-btn ${filterSeverity === sev ? 'active' : ''}`}
          >
            {sev === 'ALL' ? 'All Alerts' : sev}
          </button>
        ))}
      </div>

      {/* Alerts Table */}
      <div className="card">
        {filteredAlerts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            No logs match the selected filter.
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Alert Type</th>
                  <th>Message & Event Summary</th>
                  <th>Origin / User</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getSeverityIcon(alert.severity)}
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color:
                              alert.severity === 'CRITICAL'
                                ? '#ef4444'
                                : alert.severity === 'WARNING'
                                ? '#f59e0b'
                                : '#60a5fa',
                          }}
                        >
                          {alert.severity}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{alert.alertType}</td>
                    <td style={{ color: 'var(--text-primary)' }}>{alert.message}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {alert.user ? alert.user.fullName : 'System Core'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
