import express from "express";
const router = express.Router();
import {
  getAllSubitems,
  getSubitemById,
  createSubitem,
  updateSubitem,
  deleteSubitem,
  getSubitemsByItemId,
  getNames,
} from "../../controllers/configuration/subitemController.js";

router.get("/all", getAllSubitems);
router.get("/:id", getSubitemById);
router.post("/create", createSubitem);
router.put("/:id", updateSubitem);
router.delete("/:id", deleteSubitem);

// GET subitems by item_id with item name
router.get("/item/:item_id", getSubitemsByItemId);

// // Get name from parent_id
// router.get("/parent-name/:parent_id", getNameFromParentId);

// // Get parent name from item_id
// router.get("/item-parent-name/:item_id", getParentNameFromItemId);

// GET /api/subitems/names/:parent_id? or /api/subitems/names/:item_id?
router.get("/subitems/names/:parent_id?/:item_id?", getNames);

export default router;
