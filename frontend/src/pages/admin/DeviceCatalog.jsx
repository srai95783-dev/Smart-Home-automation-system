import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Modal } from '../../components/common/Modal';
import { Layers, Plus, CheckCircle, XCircle, Clock, Check, X, ShieldAlert } from 'lucide-react';

export const DeviceCatalog = () => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    modelName: '',
    category: 'LIGHT',
    manufacturer: '',
    protocol: 'WIFI',
    approvalStatus: 'APPROVED',
    description: '',
  });

  const loadCatalog = async () => {
    try {
      const res = await adminApi.getCatalog();
      if (res.success) {
        setCatalog(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load device catalog', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await adminApi.updateApprovalStatus(id, status);
      if (res.success) {
        setCatalog((prev) => prev.map((item) => (item.id === id ? res.data : item)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update approval status');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.addCatalogDevice(formData);
      if (res.success && res.data) {
        setCatalog((prev) => [...prev, res.data]);
        setIsModalOpen(false);
        setFormData({
          modelName: '',
          category: 'LIGHT',
          manufacturer: '',
          protocol: 'WIFI',
          approvalStatus: 'APPROVED',
          description: '',
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to add model to catalog');
    }
  };

  if (loading) {
    return <div className="page-wrapper"><p>Loading hardware compatibility catalog...</p></div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
            <CheckCircle size={14} /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
            <Clock size={14} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Device Compatibility Management</h1>
          <p className="page-subtitle">Certify, approve, or reject smart hardware models permitted on the platform</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={18} />
          <span>Add Compatible Model</span>
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Wireless Protocol</th>
                <th>Certification Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.modelName}</td>
                  <td>
                    <span className="device-room-pill">{item.category}</span>
                  </td>
                  <td>{item.manufacturer}</td>
                  <td style={{ fontWeight: 500, color: '#93c5fd' }}>{item.protocol}</td>
                  <td>{getStatusBadge(item.approvalStatus)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                    {item.description || '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {item.approvalStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--success)', color: '#34d399', padding: '0.3rem 0.6rem' }}
                          title="Approve Device Model"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                      )}
                      {item.approvalStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--danger)', color: '#f87171', padding: '0.3rem 0.6rem' }}
                          title="Reject Device Model"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Catalog Item Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Certified Device Model">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Model Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Philips Hue Smart Color Lamp"
              value={formData.modelName}
              onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="LIGHT">Smart Light</option>
              <option value="THERMOSTAT">Thermostat</option>
              <option value="SECURITY">Smart Security / Lock</option>
              <option value="APPLIANCE">Appliance / Plug</option>
              <option value="SENSOR">Sensor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Manufacturer / Brand</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Philips, Google, Ring, Samsung"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Wireless Protocol</label>
            <select
              className="form-select"
              value={formData.protocol}
              onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
            >
              <option value="WIFI">Wi-Fi (802.11 b/g/n)</option>
              <option value="ZIGBEE">Zigbee 3.0</option>
              <option value="BLUETOOTH">Bluetooth LE / Mesh</option>
              <option value="MATTER">Matter over Thread</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Approval Status</label>
            <select
              className="form-select"
              value={formData.approvalStatus}
              onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
            >
              <option value="APPROVED">APPROVED (Installable by Homeowners)</option>
              <option value="PENDING">PENDING (Under review)</option>
              <option value="REJECTED">REJECTED (Blocked from installation)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Hardware Specs</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Technical specifications and power rating..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Model
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
