import express from "express";
import {
  createResult,
  updateResult,
  getResultById,
  bulkUploadResults,
  getAllResults,
  deleteResultById,
  getFilteredStudentsomrreceipt,
  getFilteredStudentsforEvalute,
  updateMedal,
  updateMedalWild,
  bulkUploadResultsbystaff ,
} from "../../controllers/Exam/ResultController.js";
import { authenticateToken } from "../../middleware/verifyToken.js";
const router = express.Router();

// Create a single result
router.post("/result/create", authenticateToken, createResult);

// Update a result
router.put("/result/update/:id", authenticateToken, updateResult);

// Get a single result by ID
router.get("/get/:id", getResultById);

// Bulk upload student results
router.post("/upload-results", bulkUploadResults);

// Get all results
router.get("/all-results", getAllResults);

// Delete by ID
router.delete("/result/:id", authenticateToken, deleteResultById);

// POST API to get students by single class and subject
router.post("/getFilteredStudentreceipt", getFilteredStudentsomrreceipt);

// New route for updating percentages of pending records
// router.post("/update-pending-percentages", updatePendingPercentages);

// PUT depending on preference
router.put("/update-certificate", updateMedal);

//resutl achiements
router.post("/award-recognition", getFilteredStudentsforEvalute);

//updated medal for wild card
router.put("/update-medal-wildcard", updateMedalWild);

//// Bulk upload student results by staff
router.post("/upload/result/staff", bulkUploadResultsbystaff);
export default router;
