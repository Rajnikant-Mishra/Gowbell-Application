import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../controllers/question/questionController.js";

const router = express.Router();

router.post("/question", createQuestion);
router.get("/question", getAllQuestions);
router.get("/question/:id", getQuestionById);
router.put("/question/:id", updateQuestion);
router.delete("/question/:id", deleteQuestion);

export default router;
