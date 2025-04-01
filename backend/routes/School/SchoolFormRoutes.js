import express from 'express';
import { getAllSchools, getSchoolById, createSchool, updateSchool, deleteSchool, bulkUploadSchools, filterByLocation } from '../../controllers/School/SchoolFormController.js';
import { authenticateToken  } from "../../middleware/verifyToken.js";
const router = express.Router();

router.get('/schools', getAllSchools);          // Get all schools
router.get('/schools/:id', getSchoolById);      // Get school by ID
router.post('/schools',authenticateToken ,createSchool);// Create a new school
router.put('/schools/:id', updateSchool);       // Update school
router.delete('/schools/:id', deleteSchool);    // Delete school

//BULK ROUTE
router.post('/school/bulk-upload',  bulkUploadSchools); // Bulk student upload

//getschool from country...
router.get('/filter', filterByLocation);

export default router;
