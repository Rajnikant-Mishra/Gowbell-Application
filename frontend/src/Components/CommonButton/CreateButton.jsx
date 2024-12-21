import React from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from React Router
export default function CreateButton({ link }) {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <p
        className="mb-0"
        style={{
          color: "#1230AE",
          fontWeight: "500",
        }}
      >
        <FaPlus /> <span>Create</span>
      </p>
    </Link>
  );
}