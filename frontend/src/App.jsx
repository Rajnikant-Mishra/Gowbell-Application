import { useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "./Components/Admin/AdminLogin";
import "./App.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLogin />,
  },
]);
function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default App;
