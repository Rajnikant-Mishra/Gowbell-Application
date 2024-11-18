import React from "react";
import Mainlayout from "../Layouts/Mainlayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function Dashboard() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        logout(); // Clear local authentication state
        navigate("/admin"); // Redirect to admin login
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <>
      <Mainlayout>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      </Mainlayout>
    </>
  );
}
