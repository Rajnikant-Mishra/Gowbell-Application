import  express from 'express';

import  {createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion} from '../../controllers/Inventory/questionController.js';


const router = express.Router();

// Create a new book
router.post('/question', createQuestion);

// Get all books
router.get('/question', getAllQuestions);

// Get a single book by ID
router.get('/question/:id', getQuestionById);

// Update a book by ID
router.put('/question/:id', updateQuestion);

// Delete a book by ID
router.delete('/question/:id', deleteQuestion);

export default router;
