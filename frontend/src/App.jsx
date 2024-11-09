// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Components/contexts/AuthContext";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard ";


const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/admin" />;
};

const RedirectIfAuthenticated = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/admin"
            element={<RedirectIfAuthenticated element={<AdminLogin />} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<AdminDashboard />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
