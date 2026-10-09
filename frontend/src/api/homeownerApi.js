import axiosClient from './axiosClient';

export const homeownerApi = {
  // Device Controls
  getDevices: () => axiosClient.get('/homeowner/devices'),
  addDevice: (deviceData) => axiosClient.post('/homeowner/devices', deviceData),
  togglePower: (id, powerState) => axiosClient.patch(`/homeowner/devices/${id}/power`, { powerState }),
  updateSettings: (id, settingValue) => axiosClient.patch(`/homeowner/devices/${id}/settings`, { settingValue }),
  deleteDevice: (id) => axiosClient.delete(`/homeowner/devices/${id}`),
  getApprovedCatalog: () => axiosClient.get('/homeowner/catalog'),

  // Automation Rules
  getRules: () => axiosClient.get('/homeowner/rules'),
  createRule: (ruleData) => axiosClient.post('/homeowner/rules', ruleData),
  updateRule: (id, ruleData) => axiosClient.put(`/homeowner/rules/${id}`, ruleData),
  toggleRule: (id) => axiosClient.patch(`/homeowner/rules/${id}/toggle`),
  deleteRule: (id) => axiosClient.delete(`/homeowner/rules/${id}`),

  // Telemetry & Monitoring
  getEnvironment: () => axiosClient.get('/homeowner/telemetry/environment'),
  getSecurity: () => axiosClient.get('/homeowner/telemetry/security'),
  getEnergy: () => axiosClient.get('/homeowner/telemetry/energy'),

  // Alerts
  getAlerts: () => axiosClient.get('/homeowner/alerts'),
  markAlertRead: (id) => axiosClient.patch(`/homeowner/alerts/${id}/read`),
};
