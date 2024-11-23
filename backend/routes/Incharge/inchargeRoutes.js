import express from 'express';
import {
    getAllIncharges,
    getInchargeById,
    createIncharge,
    updateIncharge,
    deleteIncharge
} from '../../controllers/Incharge/InchargeController.js';

const router = express.Router();

// Route to get all incharges
router.get('/incharges', getAllIncharges);

// Route to get an incharge by ID
router.get('/incharges/:id', getInchargeById);

// Route to create a new incharge
router.post('/incharges', createIncharge);

// Route to update an existing incharge by ID
router.put('/incharges/:id', updateIncharge);

// Route to delete an incharge by ID
router.delete('/incharges/:id', deleteIncharge);

export default router;
