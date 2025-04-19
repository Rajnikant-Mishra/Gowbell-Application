import express from "express";
import { bulkUploadResults, getAllResults,deleteResultById, updatePendingPercentages} from "../../controllers/Exam/ResultController.js";

const router = express.Router();

// Bulk upload student results
router.post("/upload-results", bulkUploadResults);


// Get all results
router.get("/all-results", getAllResults);

// Delete by ID
router.delete("/result/:id", deleteResultById);

// New route for updating percentages of pending records
router.post("/update-pending-percentages", updatePendingPercentages);

export default router;
