// // src/contexts/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isAuthLoading, setIsAuthLoading] = useState(true); // New: Add loading state

//   useEffect(() => {
//     // Check if the user is logged in when the app loads
//     const loggedIn = localStorage.getItem("isAuthenticated") === "true";
//     setIsAuthenticated(loggedIn);
//     setIsAuthLoading(false); // Set loading to false after checking
//   }, []);

//   const login = () => {
//     localStorage.setItem("isAuthenticated", "true");
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("isAuthenticated");
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, isAuthLoading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check token validity
  const checkTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      logout();
      return false;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();
      
      if (isExpired) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  useEffect(() => {
    const isValid = checkTokenValidity();
    setIsAuthenticated(isValid);
    setIsAuthLoading(false);

    // Set up interval to check token periodically (e.g., every minute)
    const interval = setInterval(() => {
      checkTokenValidity();
    }, 3600000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("menus");
    localStorage.removeItem("roleDetails");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isAuthLoading, 
        login, 
        logout,
        checkTokenValidity // Expose this for manual checks
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);