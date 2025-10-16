import express from "express";
import {
  getCenters,
  getCentersAll,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
} from "../../controllers/Master/centerController.js";

const router = express.Router();

router.get("/get-all", getCenters);

router.get("/get-paginate-serach", getCentersAll);
router.get("/:id", getCenterById);
router.post("/create", createCenter);
router.put("/:id", updateCenter);
router.delete("/:id", deleteCenter);

export default router;
