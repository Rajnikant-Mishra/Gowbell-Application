
import React from "react";

import "./App.css";

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Components/Admin/AdminLogin";
import "./App.css";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
    </Routes>
  </Router>
    
  );
}

export default App;
