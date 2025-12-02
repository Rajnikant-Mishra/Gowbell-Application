import express from "express";
import {
  createStudent,
  bulkUploadStudents,
  getAllStudents,
  getStudentByAadhaar,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllstudentserach,
  getFilteredStudents,
  getFilteredStudentsomrreceipt,
  getFilteredStudentsforattendance,
  getFilteredStudentsforReport,
  getFilteredStudentsbyassignomr,
} from "../../controllers/Student/studentController.js";
import { authenticateToken } from "../../middleware/verifyToken.js";
const router = express.Router();

// Create a new student
router.post("/student", authenticateToken, createStudent);

//BULK ROUTE
router.post("/student/bulk-upload", authenticateToken, bulkUploadStudents); // Bulk student upload

// Get all students
router.get("/student", getAllStudents);

//get aadhaar number
// GET student data by Aadhaar number
router.get('/students/:aadhaar_number', getStudentByAadhaar);

// Get a single student by ID
router.get("/student/:id", getStudentById);

// Update a student by ID
router.put("/student/:id", authenticateToken, updateStudent);

// Delete a student by ID
router.delete("/student/:id",authenticateToken,   deleteStudent);

router.get("/allstudents", getAllstudentserach);

//omr issues
router.post("/student/filter", getFilteredStudents);

//omr receipt
router.post("/filter/omr-receipt", getFilteredStudentsomrreceipt);

//attendance
router.post("/student-attendance", getFilteredStudentsforattendance);

//student report 
router.post("/student-report", getFilteredStudentsforReport);

//assign omr 
router.post("/filter/omr-assign", getFilteredStudentsbyassignomr);

export default router;
