import  express from 'express';

import  {createOmr, getAllOmrs, getOmrById, updateOmr, deleteOmr} from '../../controllers/Inventory/omrController.js';


const router = express.Router();

// Create a new book
router.post('/omr', createOmr);

// Get all books
router.get('/omr', getAllOmrs);

// Get a single book by ID
router.get('/omr/:id', getOmrById);

// Update a book by ID
router.put('/omr/:id', updateOmr);

// Delete a book by ID
router.delete('/omr/:id', deleteOmr);

export default router;
