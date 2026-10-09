import React, { useState, useEffect } from 'react';
import { homeownerApi } from '../../api/homeownerApi';
import { DeviceCard } from '../../components/devices/DeviceCard';
import { Modal } from '../../components/common/Modal';
import { Plus, Filter } from 'lucide-react';

export const DeviceControl = () => {
  const [devices, setDevices] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    customName: '',
    roomLocation: 'Living Room',
    category: 'LIGHT',
    catalogId: '',
    settingValue: 50,
  });

  const loadData = async () => {
    try {
      const [devRes, catRes] = await Promise.all([
        homeownerApi.getDevices(),
        homeownerApi.getApprovedCatalog(),
      ]);
      if (devRes.success) setDevices(devRes.data || []);
      if (catRes.success) {
        setCatalog(catRes.data || []);
        if (catRes.data && catRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, catalogId: catRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load devices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const handleCreateDevice = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        catalogId: formData.catalogId ? Number(formData.catalogId) : null,
      };
      const res = await homeownerApi.addDevice(payload);
      if (res.success && res.data) {
        setDevices((prev) => [...prev, res.data]);
        setIsModalOpen(false);
        setFormData({
          customName: '',
          roomLocation: 'Living Room',
          category: 'LIGHT',
          catalogId: catalog.length > 0 ? catalog[0].id : '',
          settingValue: 50,
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to add device');
    }
  };

  const rooms = ['ALL', 'Living Room', 'Bedroom', 'Kitchen', 'Porch', 'Garage'];

  const filteredDevices =
    selectedRoom === 'ALL'
      ? devices
      : devices.filter((d) => d.roomLocation?.toLowerCase() === selectedRoom.toLowerCase());

  if (loading) {
    return <div className="page-wrapper"><p>Loading device control center...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Device Control Center</h1>
          <p className="page-subtitle">Manage power states, adjust levels, and organize devices by room</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={18} />
          <span>Add New Device</span>
        </button>
      </div>

      {/* Room Filter Pills */}
      <div className="filter-bar">
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => setSelectedRoom(room)}
            className={`filter-btn ${selectedRoom === room ? 'active' : ''}`}
          >
            {room === 'ALL' ? 'All Rooms' : room}
          </button>
        ))}
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No devices found in this room.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Add Device Here
          </button>
        </div>
      ) : (
        <div className="device-grid">
          {filteredDevices.map((device) => (
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

      {/* Add Device Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Smart Device">
        <form onSubmit={handleCreateDevice}>
          <div className="form-group">
            <label className="form-label">Device Display Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Master Bedroom Ceiling Light"
              value={formData.customName}
              onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Room Location</label>
            <select
              className="form-select"
              value={formData.roomLocation}
              onChange={(e) => setFormData({ ...formData, roomLocation: e.target.value })}
            >
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Porch">Porch / Entrance</option>
              <option value="Garage">Garage</option>
              <option value="Bathroom">Bathroom</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Device Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="LIGHT">Smart Light / Bulb</option>
              <option value="THERMOSTAT">Thermostat / Climate</option>
              <option value="SECURITY">Smart Lock / Deadbolt</option>
              <option value="APPLIANCE">Smart Plug / Appliance</option>
              <option value="SENSOR">Environmental Sensor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Approved Hardware Model</label>
            <select
              className="form-select"
              value={formData.catalogId}
              onChange={(e) => setFormData({ ...formData, catalogId: e.target.value })}
            >
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.modelName} ({item.manufacturer} - {item.protocol})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Device
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
