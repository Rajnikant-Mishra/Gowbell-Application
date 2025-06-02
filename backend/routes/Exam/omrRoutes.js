import express from 'express';
import { createOmr, getAllOmrData, getOmrById, updateOmr,  deleteOmrData } from '../../controllers/Exam/omrController.js';

const router = express.Router();

router.post('/generator', createOmr); 


// Route to get student data by roll number
router.get('/omr-data', getAllOmrData);

// Get specific OMR entry by ID along with matching students
router.get("/get/:id", getOmrById);


//update
router.put("/update/:id", updateOmr);

// Delete OMR data by ID
router.delete("/omr-data/:id", deleteOmrData);

export default router;
