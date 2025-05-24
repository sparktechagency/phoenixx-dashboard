import { Alert, message } from "antd";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    console.log(decoded);

    const currentTime = Date.now() / 1000; // seconds
    if (decoded.exp < currentTime) {
      // token expired
      localStorage.removeItem("accessToken"); // expired token remove
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    if (decoded.role === "SUPER_ADMIN") {
      return children;
    } else if (decoded.role === "USER") {
      message.error("You have no permission to login");
      return;
    } else {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
  } catch (error) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;
