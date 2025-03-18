// examRoutes.js
import  express from 'express';
import  {fetchExamDate, getSchoolCodeByName, createPacking, getAllPackings, deletePacking} from '../../controllers/packing/packingContrioller.js';

const router = express.Router();


// Fetch exam_date by school and subject
router.get('/exams/dates', fetchExamDate);

// Route to get school_code by school_name
router.get("/school-code/:school_name", getSchoolCodeByName);

router.post("/packing", createPacking);

router.get("/all-packings", getAllPackings);

router.delete("/packing/:id", deletePacking); // Delete

export default router;