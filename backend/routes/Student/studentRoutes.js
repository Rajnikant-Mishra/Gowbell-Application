import express from 'express';
import { createStudent, bulkUploadStudents, getAllStudents, getStudentById, updateStudent, deleteStudent, getStudentsByClassController } from '../../controllers/Student/studentController.js';

const router = express.Router();

// Create a new student
router.post('/student', createStudent);

//BULK ROUTE
router.post('/student/bulk-upload', bulkUploadStudents); // Bulk student upload

// Get all students
router.get('/student', getAllStudents);

// Get a single student by ID
router.get('/student/:id', getStudentById);

// Update a student by ID
router.put('/student/:id', updateStudent);

// Delete a student by ID
router.delete('/student/:id', deleteStudent);

// Define route for fetching students by class and school
router.post('/students-by-class', getStudentsByClassController);

export default router;
