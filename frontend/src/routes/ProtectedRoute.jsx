import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#60a5fa' }}>
        <h2>Loading SmartHome Platform...</h2>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect user to their respective default home dashboard
    if (user.role === 'ROLE_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/homeowner/dashboard" replace />;
    }
  }

  return children;
};
