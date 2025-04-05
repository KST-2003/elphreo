import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

const PrivateRoute = ({ element }) => {
  const token = useAuthStore((state) => state.token);

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the protected element
  return element;
};

export default PrivateRoute;
