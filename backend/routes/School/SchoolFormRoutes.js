import express from 'express';
import { getAllSchools, getAll  , getSchoolById, createSchool, updateSchool, deleteSchool, bulkUploadSchools, filterByLocation, filterschoolIDByLocation, updateStatusApproved } from '../../controllers/School/SchoolFormController.js';
import { authenticateToken  } from "../../middleware/verifyToken.js";
const router = express.Router();

router.get('/schools', getAllSchools);   // Get all schools
router.get('/all-schools', getAll  );
router.get('/schools/:id', getSchoolById);  // Get school by ID
router.post('/schools',authenticateToken ,createSchool);// Create a new school
router.put('/schools/:id', updateSchool);    // Update school
router.delete('/schools/:id', deleteSchool);  // Delete school

//BULK ROUTE
router.post('/school/bulk-upload',authenticateToken ,  bulkUploadSchools); // Bulk student upload

//getschool from country
router.get('/filter', filterByLocation);

//getschoolID from country
router.get('/school-filter', filterschoolIDByLocation);

// PUT route for updating status_approved by id
router.put('/school/:id/status-approved' ,authenticateToken , updateStatusApproved);

export default router;
  