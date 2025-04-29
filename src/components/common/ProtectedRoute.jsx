// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem("accessToken");

//   if (!isAuthenticated) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import

const ProtectedRoute = ({ children, requiredRole }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(accessToken);
    const userRole = decodedToken.role;

    // Check token expiration
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/auth/login" replace />;
    }

    // Check role if required
    if (requiredRole && !requiredRole.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("accessToken");
    return <Navigate to="/auth/login" replace />;
  }
};

export default ProtectedRoute;
