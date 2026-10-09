import React, { useState, useEffect } from 'react';
import { homeownerApi } from '../../api/homeownerApi';
import { Modal } from '../../components/common/Modal';
import { Zap, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const Automations = () => {
  const [rules, setRules] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    ruleName: '',
    triggerType: 'TEMPERATURE_HIGH',
    triggerCondition: '> 26',
    targetDeviceId: '',
    actionCommand: 'TURN_ON',
    actionValue: 'ON',
    enabled: true,
  });

  const loadData = async () => {
    try {
      const [rulesRes, devRes] = await Promise.all([
        homeownerApi.getRules(),
        homeownerApi.getDevices(),
      ]);
      if (rulesRes.success) setRules(rulesRes.data || []);
      if (devRes.success) {
        setDevices(devRes.data || []);
        if (devRes.data && devRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, targetDeviceId: devRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load rules', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (ruleId) => {
    try {
      const res = await homeownerApi.toggleRule(ruleId);
      if (res.success) {
        setRules((prev) => prev.map((r) => (r.id === ruleId ? res.data : r)));
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle rule');
    }
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm('Delete this automation rule?')) return;
    try {
      await homeownerApi.deleteRule(ruleId);
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    } catch (err) {
      alert(err.message || 'Failed to delete rule');
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        targetDeviceId: Number(formData.targetDeviceId),
      };
      const res = await homeownerApi.createRule(payload);
      if (res.success && res.data) {
        setRules((prev) => [...prev, res.data]);
        setIsModalOpen(false);
        setFormData({
          ruleName: '',
          triggerType: 'TEMPERATURE_HIGH',
          triggerCondition: '> 26',
          targetDeviceId: devices.length > 0 ? devices[0].id : '',
          actionCommand: 'TURN_ON',
          actionValue: 'ON',
          enabled: true,
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to create automation rule');
    }
  };

  if (loading) {
    return <div className="page-wrapper"><p>Loading automation engine...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Smart Automation Rules</h1>
          <p className="page-subtitle">Configure trigger-based automated actions evaluated in real time</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={18} />
          <span>New Automation Rule</span>
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No automation rules configured yet.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Create Your First Rule
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderLeft: `4px solid ${rule.enabled ? 'var(--primary)' : 'var(--text-muted)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: rule.enabled ? 'var(--primary-light)' : 'rgba(255,255,255,0.05)',
                    color: rule.enabled ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                >
                  <Zap size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{rule.ruleName}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>
                      <strong>Trigger:</strong> {rule.triggerType} ({rule.triggerCondition})
                    </span>
                    <span>
                      <strong>Action:</strong> {rule.actionCommand} on {rule.targetDevice?.customName || 'Target Device'}
                    </span>
                  </div>
                  {rule.lastTriggered && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Last executed: {new Date(rule.lastTriggered).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => handleToggle(rule.id)}
                  className={`btn btn-sm ${rule.enabled ? 'btn-primary' : 'btn-outline'}`}
                  style={{ gap: '0.4rem' }}
                >
                  {rule.enabled ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>{rule.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => handleDelete(rule.id)}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#f87171', border: 'none' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Rule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Automation Rule">
        <form onSubmit={handleCreateRule}>
          <div className="form-group">
            <label className="form-label">Rule Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Auto-Cool Living Room When Hot"
              value={formData.ruleName}
              onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trigger Event Type</label>
            <select
              className="form-select"
              value={formData.triggerType}
              onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
            >
              <option value="TEMPERATURE_HIGH">When Temperature Exceeds</option>
              <option value="TEMPERATURE_LOW">When Temperature Drops Below</option>
              <option value="HUMIDITY_HIGH">When Humidity Exceeds</option>
              <option value="TIME">At Scheduled Time (HH:mm)</option>
              <option value="MOTION_DETECTED">When Motion is Detected</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Condition Value</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. > 26 or 22:00 or DETECTED"
              value={formData.triggerCondition}
              onChange={(e) => setFormData({ ...formData, triggerCondition: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Smart Device</label>
            <select
              className="form-select"
              value={formData.targetDeviceId}
              onChange={(e) => setFormData({ ...formData, targetDeviceId: e.target.value })}
            >
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.customName} ({device.roomLocation})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Action Command</label>
            <select
              className="form-select"
              value={formData.actionCommand}
              onChange={(e) => setFormData({ ...formData, actionCommand: e.target.value })}
            >
              <option value="TURN_ON">Turn ON Device</option>
              <option value="TURN_OFF">Turn OFF Device</option>
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
