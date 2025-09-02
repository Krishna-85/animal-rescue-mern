import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (user === null) {
    // User state abhi load ho raha hai
    return <div>Loading...</div>;
  }

  if (!user?.token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/quick-report" replace />;
  }

  return children;
};


export default ProtectedRoute;
