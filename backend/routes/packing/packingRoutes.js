// examRoutes.js
import  express from 'express';
import  {fetchExamDate, getSchoolCodeByName, createPacking, getAllPackings, deletePacking,  getPackingById, updatePacking} from '../../controllers/packing/packingContrioller.js';

const router = express.Router();


// Fetch exam_date by school and subject
router.get('/exams/dates', fetchExamDate);

// Route to get school_code by school_name
router.get("/school-code/:school_name", getSchoolCodeByName);

router.post("/packing", createPacking);

router.get("/all-packings", getAllPackings);

router.delete("/packing/:id", deletePacking); // Delete

// ✅ Get Packing by ID
router.get("/packing/:id", getPackingById);

// ✅ Update Packing
router.put("/update/:id", updatePacking);

export default router;