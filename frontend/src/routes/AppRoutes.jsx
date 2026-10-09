import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Homeowner Pages
import { HomeDashboard } from '../pages/homeowner/HomeDashboard';
import { DeviceControl } from '../pages/homeowner/DeviceControl';
import { Automations } from '../pages/homeowner/Automations';
import { Environment } from '../pages/homeowner/Environment';
import { SecurityStatus } from '../pages/homeowner/SecurityStatus';
import { EnergyAnalytics } from '../pages/homeowner/EnergyAnalytics';
import { Profile } from '../pages/homeowner/Profile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { DeviceCatalog } from '../pages/admin/DeviceCatalog';
import { SystemAlerts } from '../pages/admin/SystemAlerts';
import { SystemSettings } from '../pages/admin/SystemSettings';

const AppLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      {children}
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Homeowner Routes */}
        <Route
          path="/homeowner/dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_HOMEOWNER">
              <AppLayout>
                <HomeDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeowner/devices"
          element={
            <ProtectedRoute allowedRole="ROLE_HOMEOWNER">
              <AppLayout>
                <DeviceControl />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeowner/automations"
          element={
            <ProtectedRoute allowedRole="ROLE_HOMEOWNER">
              <AppLayout>
                <Automations />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeowner/environment"
          element={
            <ProtectedRoute allowedRole="ROLE_HOMEOWNER">
              <AppLayout>
                <Environment />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeowner/security"
          element={
            <ProtectedRoute allowedRole="ROLE_HOMEOWNER">
              <AppLayout>
                <SecurityStatus />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeowner/energy"
          element={
            <ProtectedRoute allowedRole="ROLE_HOMEOWNER">
              <AppLayout>
                <EnergyAnalytics />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeowner/profile"
          element={
            <ProtectedRoute allowedRole="ROLE_HOMEOWNER">
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <AppLayout>
                <UserManagement />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/devices"
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <AppLayout>
                <DeviceCatalog />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <AppLayout>
                <SystemAlerts />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <AppLayout>
                <SystemSettings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Root Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
