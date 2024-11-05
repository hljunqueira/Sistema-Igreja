// frontend/src/components/Routes/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, signed } = useAuth();

  if (!signed) {
    return <Navigate to="/login" />;
  }

  if (!user?.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
