import express from 'express';
import  { fetchActivities } from "../../controllers/dashboard/activityController.js";

const router = express.Router();

router.get("/activities", fetchActivities);

export default router;
