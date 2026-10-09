import React, { useState, useEffect } from 'react';
import { homeownerApi } from '../../api/homeownerApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Zap, DollarSign, TrendingDown, Leaf } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const EnergyAnalytics = () => {
  const [energyLogs, setEnergyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await homeownerApi.getEnergy();
      if (res.success) {
        setEnergyLogs(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load energy analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aggregate energy by date for the chart
  const dateMap = {};
  energyLogs.forEach((log) => {
    const d = log.logDate;
    dateMap[d] = (dateMap[d] || 0) + log.energyKwh;
  });

  const sortedDates = Object.keys(dateMap).sort();
  const dailyValues = sortedDates.map((d) => Math.round(dateMap[d] * 100) / 100);

  const totalKwh = dailyValues.reduce((acc, curr) => acc + curr, 0);
  const costPerKwh = 0.14; // $0.14 per kWh
  const estimatedCost = Math.round(totalKwh * costPerKwh * 100) / 100;

  const chartData = {
    labels: sortedDates.map((d) => {
      const parsed = new Date(d);
      return parsed.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Energy Consumed (kWh)',
        data: dailyValues,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8' } },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Energy (kWh)', color: '#94a3b8' },
      },
    },
  };

  if (loading) {
    return <div className="page-wrapper"><p>Calculating power analytics...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Energy Consumption Analytics</h1>
          <p className="page-subtitle">Track power usage, estimate electricity costs, and optimize household efficiency</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Zap size={26} />
          </div>
          <div>
            <div className="stat-val">{Math.round(totalKwh * 10) / 10} kWh</div>
            <div className="stat-label">Past 7 Days Total Usage</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div className="stat-val">${estimatedCost}</div>
            <div className="stat-label">Estimated Electricity Cost (@$0.14/kWh)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)' }}>
            <TrendingDown size={26} />
          </div>
          <div>
            <div className="stat-val">-12.4%</div>
            <div className="stat-label">Compared to Previous Week</div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card" style={{ height: '420px', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Daily Household Power Usage (kWh)
        </h3>
        <div style={{ height: '340px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Eco Tips */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      >
        <Leaf size={32} color="#10b981" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ color: '#34d399', fontWeight: 600, fontSize: '1rem' }}>Energy Saving Tip</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Setting your smart thermostat to 24°C instead of 21°C during peak afternoon hours can reduce air
            conditioning electricity consumption by up to 18%. Use our <strong>Automation Rules</strong> to automate this schedule!
          </p>
        </div>
      </div>
    </div>
  );
};
