import React, { useState, useEffect } from 'react';
import { homeownerApi } from '../../api/homeownerApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Thermometer, Droplets, RefreshCw, Info } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Environment = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await homeownerApi.getEnvironment();
      if (res.success) {
        setTelemetry(res.data);
      }
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // 10s live poll
    return () => clearInterval(interval);
  }, []);

  const tempHistory = telemetry?.temperatureHistory || [];
  const humHistory = telemetry?.humidityHistory || [];

  // Reverse so older points are on left, newest on right
  const sortedTemps = [...tempHistory].reverse();
  const sortedHums = [...humHistory].reverse();

  const labels = sortedTemps.map((d) =>
    new Date(d.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const chartData = {
    labels: labels.length > 0 ? labels : ['12:00', '13:00', '14:00', '15:00', '16:00'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sortedTemps.map((d) => d.readingValue),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.35,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Humidity (%)',
        data: sortedHums.map((d) => d.readingValue),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.35,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#38bdf8' },
        title: { display: true, text: 'Temperature (°C)', color: '#38bdf8' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#10b981' },
        title: { display: true, text: 'Humidity (%)', color: '#10b981' },
      },
    },
  };

  if (loading) {
    return <div className="page-wrapper"><p>Connecting to environmental sensors...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Environmental Telemetry</h1>
          <p className="page-subtitle">Real-time room climate monitoring with trend analysis</p>
        </div>
        <button onClick={loadData} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Info Callout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: '#93c5fd',
        }}
      >
        <Info size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Simulated Sensor Stream:</strong> Spring Boot's background <code>@Scheduled</code> simulation
          engine dynamically generates fluctuating sensor values and updates this telemetry every 25 seconds.
        </span>
      </div>

      {/* Gauges */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Thermometer size={28} />
          </div>
          <div>
            <div className="stat-val">{telemetry?.currentTemperature ?? 24.5}°C</div>
            <div className="stat-label">Current Room Temperature</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Optimal Comfort Zone</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <Droplets size={28} />
          </div>
          <div>
            <div className="stat-val">{telemetry?.currentHumidity ?? 52}%</div>
            <div className="stat-label">Relative Ambient Humidity</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Normal (30% - 60%)</span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="card" style={{ height: '420px', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Historical Climate Trend (Last 15 Telemetry Readings)
        </h3>
        <div style={{ height: '340px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Reading Log Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Sensor Readings Log</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Sensor Type</th>
                <th>Reading Value</th>
                <th>Unit</th>
                <th>Recorded Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {tempHistory.slice(0, 8).map((item) => (
                <tr key={item.id}>
                  <td>{item.roomLocation}</td>
                  <td>{item.sensorType}</td>
                  <td style={{ fontWeight: 600, color: '#38bdf8' }}>{item.readingValue}</td>
                  <td>{item.unit}</td>
                  <td>{new Date(item.recordedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
