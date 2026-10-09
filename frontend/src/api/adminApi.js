import axiosClient from './axiosClient';

export const adminApi = {
  // User Management
  getUsers: () => axiosClient.get('/admin/users'),
  createUser: (userData) => axiosClient.post('/admin/users', userData),
  updateUser: (id, userData) => axiosClient.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),

  // Device Catalog Compatibility
  getCatalog: () => axiosClient.get('/admin/devices/catalog'),
  addCatalogDevice: (deviceData) => axiosClient.post('/admin/devices/catalog', deviceData),
  updateApprovalStatus: (id, status) =>
    axiosClient.patch(`/admin/devices/catalog/${id}/approval?status=${status}`),

  // System Monitoring & Alerts
  getMetrics: () => axiosClient.get('/admin/system/metrics'),
  getAlerts: () => axiosClient.get('/admin/system/alerts'),

  // System Settings
  getSettings: () => axiosClient.get('/admin/settings'),
  updateSetting: (key, data) => axiosClient.put(`/admin/settings/${key}`, data),
};
