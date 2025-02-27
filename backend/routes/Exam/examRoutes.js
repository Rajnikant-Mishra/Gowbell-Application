import express from "express";
import { createExam, getExams, updateExam, deleteExam } from "../../controllers/Exam/examController.js";

const router = express.Router();

router.post("/create-exam", createExam);
router.get("/get-exams", getExams);
router.put("/update-exam/:id", updateExam);
router.delete("/delete-exam/:id", deleteExam);

export default router;
