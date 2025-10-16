import express from 'express';
import DashboardController  from "../../controllers/dashboard/dashbaordController.js";

const router = express.Router();

// GET /api/dashboard/counts
router.get("/counts", DashboardController.getCounts);

router.get("/exams", DashboardController.getExamsBySchool);

// 📊 Get participation per year
router.get("/participation-per-year", DashboardController.getParticipationPerYear);


// Get all
router.get("/omr-data", DashboardController.getOmrData);


// GET Average Percentage
router.get("/average-percentage", DashboardController.getAveragePercentage);


router.get("/students-per-subject",  DashboardController.getSubjectCounts);

export default router;
