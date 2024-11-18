// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { Admin } from "../../models/Admin/Admin.js";


// Admin login controller
export const login = async (req, res) => {
  const { username,email, password } = req.body;

  try {
    // Ensure email is not null or undefined
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username , Email and password  are required" });
    }

    // Fetch admin by email
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Respond with a success message and token
    res.json({ 
      message: "Admin login successful", 
      token, 
      admin: {
        id: admin.id,
        username:admin.username,
        email: admin.email,
        // name: admin.name 
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin logout controller
export const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};
