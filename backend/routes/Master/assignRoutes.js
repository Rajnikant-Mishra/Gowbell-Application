import express from "express";
import {
  createAssignCenter,
  getAllAssignCenters,
  getAssignCenterById,
  updateAssignCenter,
  deleteAssignCenter,
} from "../../controllers/Master/assignController.js";

const router = express.Router();

router.post("/create", createAssignCenter);
router.get("/", getAllAssignCenters);
router.get("/:id", getAssignCenterById);
router.put("/update/:id", updateAssignCenter);
router.delete("/delete/:id", deleteAssignCenter);

export default router;
