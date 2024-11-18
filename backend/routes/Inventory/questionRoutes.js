import express from 'express';
import { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } from '../../controllers/Inventory/questionController.js';

const router = express.Router();

// Create a new question
router.post('/question', createQuestion);

// Get all questions
router.get('/question', getAllQuestions);

// Get a question by ID
router.get('/question/:id', getQuestionById);

// Update a question by ID
router.put('/question/:id', updateQuestion);

// Delete a question by ID
router.delete('/question/:id', deleteQuestion);

export default router;
