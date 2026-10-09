import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Settings, Save, CheckCircle, AlertCircle } from 'lucide-react';

export const SystemSettings = () => {
  const [settings, setSettings] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});

  const loadSettings = async () => {
    try {
      const res = await adminApi.getSettings();
      if (res.success) {
        setSettings(res.data || []);
        const vals = {};
        res.data?.forEach((s) => {
          vals[s.settingKey] = s.settingValue;
        });
        setEditValues(vals);
      }
    } catch (err) {
      console.error('Failed to load system settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (key, description) => {
    try {
      const res = await adminApi.updateSetting(key, {
        settingValue: editValues[key],
        description: description,
      });
      if (res.success) {
        setFeedback((prev) => ({ ...prev, [key]: 'Saved!' }));
        setTimeout(() => {
          setFeedback((prev) => ({ ...prev, [key]: null }));
        }, 2500);
      }
    } catch (err) {
      alert(err.message || 'Failed to save setting');
    }
  };

  if (loading) {
    return <div className="page-wrapper"><p>Retrieving platform settings...</p></div>;
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '850px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Global System Settings</h1>
          <p className="page-subtitle">Configure runtime parameters, security limits, and operational defaults</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {settings.map((s) => (
          <div key={s.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {s.settingKey}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {s.description || 'Global configuration parameter'}
                </p>
              </div>
              {feedback[s.settingKey] && (
                <span style={{ fontSize: '0.85rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={16} /> Saved!
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                value={editValues[s.settingKey] || ''}
                onChange={(e) => setEditValues({ ...editValues, [s.settingKey]: e.target.value })}
              />
              <button
                type="button"
                onClick={() => handleSave(s.settingKey, s.description)}
                className="btn btn-primary"
                style={{ gap: '0.4rem', padding: '0.7rem 1.25rem' }}
              >
                <Save size={16} />
                <span>Update</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
