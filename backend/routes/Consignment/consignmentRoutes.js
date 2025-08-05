import express from 'express';
import {
    createConsignment,
    getAllConsignments,
    getAllConsignmentspaginate ,
    getConsignmentById,
    updateConsignment,
    deleteConsignment
} from '../../controllers/Consignment/consignmentController.js';
import { authenticateToken  } from "../../middleware/verifyToken.js";
const router = express.Router();

// Create a new consignment
router.post('/consignments',authenticateToken, createConsignment);

// Get all consignments
router.get('/consignments', getAllConsignments);

// Get all consignments with paginate serach also 
router.get('/paginate-consignments',  getAllConsignmentspaginate);

// Get a single consignment by ID
router.get('/consignments/:id', getConsignmentById);

// Update a consignment by ID
router.put('/consignments/:id', updateConsignment);

// Delete a consignment by ID
router.delete('/consignments/:id', deleteConsignment);

export default router;
