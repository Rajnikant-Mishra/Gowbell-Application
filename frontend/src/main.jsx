import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLogin from "./Components/Admin/AdminLogin";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLogin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
