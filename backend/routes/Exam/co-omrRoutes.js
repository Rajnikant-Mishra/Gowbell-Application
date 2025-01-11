import express from 'express';

import { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } from '../../controllers/Exam/omrController.js';

const router = express.Router();


// Create a new student
router.post('/omr', createStudent);

// Get all students
router.get('/omr', getAllStudents);

// Get a single student by ID
router.get('/omr/:id', getStudentById);

// Update a student by ID
router.put('/omr/:id', updateStudent);

// Delete a student by ID
router.delete('/omr/:id', deleteStudent);

export default router;
