import express from "express";
import {
  createStudent,
  bulkUploadStudents,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByClassController,
  getClassesBySchool,
  getStudentsBySubjectClassAndSchool,getAllstudentserach ,
} from "../../controllers/Student/studentController.js";
import { authenticateToken } from "../../middleware/verifyToken.js";
const router = express.Router();

// Create a new student
router.post("/student", authenticateToken, createStudent);

//BULK ROUTE
router.post("/student/bulk-upload", authenticateToken, bulkUploadStudents); // Bulk student upload

// Get all students
router.get("/student", getAllStudents);

// Get a single student by ID
router.get("/student/:id", getStudentById);

// Update a student by ID
router.put("/student/:id", updateStudent);

// Delete a student by ID
router.delete("/student/:id", deleteStudent);

// Define route for fetching students by class and school
router.post("/students-by-class", getStudentsByClassController);

// Fetch classes by school
router.get("/students-by-classes", getClassesBySchool);

// // Fetch subjects by class and school
// router.get('/students-by-subjects', getSubjectsByClassAndSchool);

// Fetch students by subject, class, and school
router.get("/students-by-all", getStudentsBySubjectClassAndSchool);

router.get("/allstudents", getAllstudentserach );

export default router;
