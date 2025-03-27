// // src/ProtectedRoute.js
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// const ProtectedRoute = ({ element }) => {
//   const { isAuthenticated, isAuthLoading } = useAuth();
//   const location = useLocation();

//   if (isAuthLoading) {
//     return <div>Loading...</div>; // Show a loading spinner or message
//   }

//   return isAuthenticated ? (
//     element
//   ) : (
//     <Navigate to="/" state={{ from: location }} replace />
//   );
// };

// export default ProtectedRoute;


import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isAuthLoading, checkTokenValidity } = useAuth();
  const location = useLocation();

  // Perform an immediate token check when accessing protected routes
  const isValid = checkTokenValidity();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && isValid ? (
    element
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;