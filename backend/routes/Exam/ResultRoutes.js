import express from "express";
import {createResult,updateResult,getResultById,  bulkUploadResults, getAllResults, deleteResultById, getFilteredStudentsomrreceipt, updateMedal} from "../../controllers/Exam/ResultController.js";

const router = express.Router();

// Create a single result
router.post('/result/create', createResult);

// Update a result
router.put('/result/update/:id', updateResult);

// Get a single result by ID
router.get('/get/:id', getResultById);

// Bulk upload student results
router.post("/upload-results", bulkUploadResults);


// Get all results
router.get("/all-results", getAllResults);

// Delete by ID
router.delete("/result/:id", deleteResultById);


// POST API to get students by single class and subject
router.post('/getFilteredStudentreceipt', getFilteredStudentsomrreceipt);


// New route for updating percentages of pending records
// router.post("/update-pending-percentages", updatePendingPercentages);

// PUT depending on preference
router.put("/update-certificate", updateMedal);

export default router;
