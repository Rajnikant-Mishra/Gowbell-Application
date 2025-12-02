import express from "express";
import {
  createOmrAssign,
  getAllOmrAssigns,
  getOmrAssignById,

  deleteOmrAssign,
  updateOmrStatusIfExists,
} from "../../controllers/Exam/omrAssignController.js";

const router = express.Router();

router.post("/", createOmrAssign);
router.get("/", getAllOmrAssigns);
router.get("/:id", getOmrAssignById);
// router.put("/:id", updateOmrAssign);
router.delete("/:id", deleteOmrAssign);


router.put("/update", updateOmrStatusIfExists);

export default router;
