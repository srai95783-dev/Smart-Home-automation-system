import React, { useState } from 'react';
import {
  Lightbulb,
  Thermometer,
  Shield,
  Tv,
  Radio,
  Power,
  Trash2,
  Sliders,
} from 'lucide-react';

export const DeviceCard = ({ device, onTogglePower, onUpdateSetting, onDelete }) => {
  const [sliderVal, setSliderVal] = useState(device.settingValue || 24);
  const isPoweredOn = device.powerState === 'ON';

  const getCategoryIcon = (category) => {
    switch (category?.toUpperCase()) {
      case 'LIGHT':
        return <Lightbulb size={24} color={isPoweredOn ? '#facc15' : '#94a3b8'} />;
      case 'THERMOSTAT':
        return <Thermometer size={24} color={isPoweredOn ? '#38bdf8' : '#94a3b8'} />;
      case 'SECURITY':
        return <Shield size={24} color={isPoweredOn ? '#4ade80' : '#94a3b8'} />;
      case 'APPLIANCE':
        return <Tv size={24} color={isPoweredOn ? '#c084fc' : '#94a3b8'} />;
      default:
        return <Radio size={24} color={isPoweredOn ? '#60a5fa' : '#94a3b8'} />;
    }
  };

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setSliderVal(val);
  };

  const handleSliderRelease = () => {
    onUpdateSetting(device.id, sliderVal);
  };

  const isThermostat = device.category?.toUpperCase() === 'THERMOSTAT';
  const minSlider = isThermostat ? 16 : 0;
  const maxSlider = isThermostat ? 32 : 100;
  const unit = isThermostat ? '°C' : '%';

  return (
    <div className={`device-card ${isPoweredOn ? 'powered-on' : ''}`}>
      <div className="device-top">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div
            style={{
              padding: '0.6rem',
              borderRadius: '10px',
              backgroundColor: isPoweredOn ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getCategoryIcon(device.category)}
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{device.customName}</h4>
            <span className="device-room-pill">{device.roomLocation}</span>
          </div>
        </div>

        <div className="device-status-badge">
          <span className={`status-dot ${device.status?.toLowerCase() === 'online' ? 'online' : 'offline'}`} />
          <span style={{ color: 'var(--text-secondary)' }}>{device.status}</span>
        </div>
      </div>

      {/* Setting Adjuster (Brightness / Temperature) */}
      <div style={{ margin: '0.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isThermostat ? 'Target Temperature' : 'Level / Brightness'}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {sliderVal}{unit}
          </span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min={minSlider}
            max={maxSlider}
            value={sliderVal}
            disabled={!isPoweredOn}
            onChange={handleSliderChange}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            className="custom-range"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => onTogglePower(device.id, isPoweredOn ? 'OFF' : 'ON')}
          className={`btn btn-sm ${isPoweredOn ? 'btn-primary' : 'btn-outline'}`}
          style={{
            gap: '0.4rem',
            backgroundColor: isPoweredOn ? '#10b981' : 'transparent',
            borderColor: isPoweredOn ? '#10b981' : 'var(--border-color)',
          }}
        >
          <Power size={14} />
          <span>{isPoweredOn ? 'Turn OFF' : 'Turn ON'}</span>
        </button>

        <button
          onClick={() => onDelete(device.id)}
          className="btn btn-outline btn-sm"
          style={{ color: '#f87171', border: 'none', padding: '0.4rem' }}
          title="Remove Device"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
