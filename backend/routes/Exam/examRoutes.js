import express from "express";
import { createExam, getExams, updateExam, deleteExam,getExamsWithStudents } from "../../controllers/Exam/examController.js";
import { authenticateToken  } from "../../middleware/verifyToken.js";
const router = express.Router();

router.post("/create-exam", authenticateToken , createExam);
router.get("/get-exams", getExams);
router.put("/update-exam/:id", updateExam);
router.delete("/delete-exam/:id", deleteExam);

// GET /api/exams-with-student-details
router.get("/exams-with-student-details",getExamsWithStudents);

export default router;
