// routes/areaRoutes.js
import express from 'express';

import  {createArea, getAllAreas, getAreaById, updateArea, deleteArea} from '../../controllers/Region/areaController.js';


const router = express.Router();


router.post('/', createArea);      // Create a new area
router.get('/', getAllAreas);      // Get all areas
router.get('/:id', getAreaById);   // Get area by ID
router.put('/:id', updateArea);    // Update area by ID
router.delete('/:id', deleteArea); // Delete area by ID

export default router;
