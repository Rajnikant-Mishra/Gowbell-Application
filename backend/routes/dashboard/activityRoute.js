import express from 'express';
import  { getActivities } from "../../controllers/dashboard/activityController.js";

const router = express.Router();

router.get("/activities", getActivities);

export default router;
