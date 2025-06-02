import express from "express";
import {
  createStudent,
  bulkUploadStudents,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllstudentserach,
  getFilteredStudents,
  getFilteredStudentsomrreceipt,
  getFilteredStudentsforattendance,

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


router.get("/allstudents", getAllstudentserach);

//omr issues
router.post("/student/filter", getFilteredStudents);

//omr receipt
router.post("/filter/omr-receipt", getFilteredStudentsomrreceipt);

//attendance

router.post("/student-attendance", getFilteredStudentsforattendance);



export default router;
