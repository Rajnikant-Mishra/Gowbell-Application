import express from "express";
import { bulkUploadResults, getAllResults } from "../../controllers/Exam/ResultController.js";

const router = express.Router();

// Bulk upload student results
router.post("/upload-results", bulkUploadResults);


// Get all results
router.get("/all-results", getAllResults);

export default router;
