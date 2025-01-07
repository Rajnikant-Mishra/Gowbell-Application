import  express from 'express';
const router = express.Router();
import  {createExam,  getExams, getExamById, updateExam,  deleteExam} from '../../controllers/Exam/examController.js';

// Create a new exam
router.post('/exams', createExam);

// Get all exams
router.get('/exams', getExams);

// Get exam by ID
router.get('/exams/:id', getExamById);

// Update exam by ID
router.put('/exams/:id', updateExam);

// Delete exam by ID
router.delete('/exams/:id', deleteExam);

export default router;
