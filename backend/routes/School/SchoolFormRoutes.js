import  express from 'express';

const router = express.Router();

import  {getAllSchools, getSchoolById, createSchool, updateSchool, deleteSchool} from '../../controllers/School/SchoolFormController.js';

router.get('/school', getAllSchools);         // Get all schools
router.get('/school/:id', getSchoolById);      // Get school by ID
router.post('/school', createSchool);         // Create a new school
router.put('/school/:id', updateSchool);       // Update school
router.delete('/school/:id', deleteSchool);    // Delete school

export default router;
