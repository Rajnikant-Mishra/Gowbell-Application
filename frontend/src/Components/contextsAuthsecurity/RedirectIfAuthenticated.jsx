// src/RedirectIfAuthenticated.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RedirectIfAuthenticated = ({ element }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

export default RedirectIfAuthenticated;
