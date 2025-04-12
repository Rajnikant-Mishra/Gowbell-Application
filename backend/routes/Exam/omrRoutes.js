import express from 'express';
import { createOmr, getAllOmrData, deleteOmrData } from '../../controllers/Exam/omrController.js';

const router = express.Router();

router.post('/generator', createOmr); 


// Route to get student data by roll number
router.get('/omr-data', getAllOmrData);

// Delete OMR data by ID
router.delete("/omr-data/:id", deleteOmrData);

export default router;
