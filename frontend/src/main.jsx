import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLogin from "./Components/Admin/AdminLogin";
import Dashboard from "./Components/Pages/Dashboard";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLogin />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
