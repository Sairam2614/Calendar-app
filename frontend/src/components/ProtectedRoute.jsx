import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, requiredRole, children }) => {
  // Check if the user is logged in
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the correct role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If the user has the correct role, render the child component
  return children;
};

export default ProtectedRoute;
