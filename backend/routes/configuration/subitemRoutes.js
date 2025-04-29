import express from 'express';
const router = express.Router();
import {getAllSubitems,  getSubitemById, createSubitem, updateSubitem, deleteSubitem, getSubitemsByItemId} from "../../controllers/configuration/subitemController.js";

router.get("/all", getAllSubitems);
router.get("/:id", getSubitemById);
router.post("/create", createSubitem);
router.put("/:id", updateSubitem);
router.delete("/:id", deleteSubitem);

// GET subitems by item_id with item name
router.get("/item/:item_id", getSubitemsByItemId);

export default router;
