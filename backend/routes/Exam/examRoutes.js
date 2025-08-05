import express from "express";
import {
  createExam,
  getExamswithpagination,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
 getExamsBySchoolClassSubject,
} from "../../controllers/Exam/examController.js";
import { authenticateToken } from "../../middleware/verifyToken.js";
const router = express.Router();

router.post("/create-exam", authenticateToken, createExam);
router.get("/get-exams-paginate", getExamswithpagination);
router.get("/get-exams", getExams);
router.get("/get/exam/:id", getExamById);
router.put("/update-exam/:id", authenticateToken, updateExam);
router.delete("/delete-exam/:id", deleteExam);

//get exam date by school, classes, subject
router.post("/exam-date",  getExamsBySchoolClassSubject);
export default router;
