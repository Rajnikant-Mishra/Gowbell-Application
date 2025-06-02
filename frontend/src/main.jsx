// import React, { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";



// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );


import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // React 18 way
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
