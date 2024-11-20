import express from 'express';
import { getAllSchools, getSchoolById, createSchool, updateSchool, deleteSchool } from '../../controllers/School/SchoolFormController.js';

const router = express.Router();

router.get('/schools', getAllSchools);          // Get all schools
router.get('/schools/:id', getSchoolById);      // Get school by ID
router.post('/schools', createSchool);          // Create a new school
router.put('/schools/:id', updateSchool);       // Update school
router.delete('/schools/:id', deleteSchool);    // Delete school

export default router;
