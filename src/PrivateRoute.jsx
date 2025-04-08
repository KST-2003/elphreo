import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { token, isAuthenticated } = useAuthStore();

  console.log("[PrivateRoute] token:", token);
  console.log("[PrivateRoute] isAuthenticated:", isAuthenticated);

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
