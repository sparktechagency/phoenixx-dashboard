// import { Navigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode"; // Correct import

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const accessToken = localStorage.getItem("accessToken");

//   if (!accessToken) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   try {
//     const decodedToken = jwtDecode(accessToken);
//     const userRole = decodedToken.role;

//     // Check token expiration
//     if (decodedToken.exp * 1000 < Date.now()) {
//       localStorage.removeItem("accessToken");
//       return <Navigate to="/auth/login" replace />;
//     }

//     // Check role if required
//     if (requiredRole && !requiredRole.includes(userRole)) {
//       return <Navigate to="/unauthorized" replace />;
//     }

//     return children;
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     localStorage.removeItem("accessToken");
//     return <Navigate to="/auth/login" replace />;
//   }
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
    const currentTime = Date.now() / 1000; // Convert to seconds to match JWT exp format

    // Calculate and log time remaining before expiration
    // const timeRemainingSeconds = decodedToken.exp - currentTime;
    // const timeRemainingMinutes = Math.floor(timeRemainingSeconds / 60);
    // const remainingSeconds = Math.floor(timeRemainingSeconds % 60);
    // console.log(
    //   `Token expires in: ${timeRemainingMinutes} minutes and ${remainingSeconds} seconds`
    // );

    // Check token expiration - exp is in seconds, Date.now() is in milliseconds
    if (decodedToken.exp < currentTime) {
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
