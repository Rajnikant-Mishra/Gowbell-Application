import express from 'express';
 
import { getAllQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } from '../../controllers/Consignment/questionCoController.js';


const router = express.Router();

router.get("/question", getAllQuestions);
router.get("/question/:id", getQuestionById);
router.post("/question", createQuestion);
router.put("/question/:id", updateQuestion);
router.delete("/question/:id", deleteQuestion);

export default router;
