// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

const PrivateRoute = ({ children }) => {
  const { user } = useAuthStore();

  // if (user === null) {
  //   return <div>Loading...</div>; // Prevent premature redirect
  // }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;




