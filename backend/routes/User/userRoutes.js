import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
} from "../../controllers/User/userController.js";
import { authenticateToken } from "../../middleware/verifyToken.js";
import upload from "../../middleware/Usermulter.js";

const router = express.Router();



// router.post("/users", createUser);
router.post("/users", upload.single("user_profile"), createUser);
router.post("/users/login", loginUser);
router.post("/users/logout", logoutUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
// router.put("/users/:id", updateUser);
router.put("/users/:id", upload.single("user_profile"), updateUser);
router.delete("/users/:id", deleteUser);



// Update password + optional profile image
router.put("/:id/password", upload.single("user_profile"),updatePassword);

export default router;
