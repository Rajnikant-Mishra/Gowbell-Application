import express from "express";
import { login, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Admin } from "../models/Admin.js"; // Import Admin model

const router = express.Router();

// Login and logout routes
router.post("/login", login);
router.post("/logout", logout, authMiddleware );

// Admin setup route to update username, email, and password
router.post("/setup-admin", async (req, res) => {
  const { id, username, email, password } = req.body;

  if (!id || !username || !email || !password) {
    return res.status(400).json({ message: "All fields (id, username, email, password) are required." });
  }

  try {
    // Find admin by ID
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Update admin details
    await Admin.updateAdminDetails(admin.id, username, email, password);

    res.json({ message: "Admin details updated successfully." });
  } catch (error) {
    console.error("Error during admin setup:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
