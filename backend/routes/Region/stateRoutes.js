// routes/stateRoutes.js
import express from 'express';
import {createState, getAllStates, getStateById, updateState, deleteState} from '../../controllers/Region/stateController.js';

const router = express.Router();


router.post('/', createState);     // Create a new state
router.get('/', getAllStates);     // Get all states
router.get('/:id', getStateById);  // Get a single state by ID
router.put('/:id', updateState);   // Update a state by ID
router.delete('/:id', deleteState);// Delete a state by ID

export default router;
