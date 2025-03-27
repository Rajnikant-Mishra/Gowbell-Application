// routes/cityRoutes.js
import express from 'express';

import {createCity, getAllCities, getCityById, updateCity, deleteCity, getAll} from '../../controllers/Region/cityController.js';
import { authenticateToken  } from "../../middleware/verifyToken.js";
const router = express.Router();

router.post('/',authenticateToken , createCity);      // Create a new city
router.get('/', getAllCities);      // Get all cities
router.get('/:id', getCityById);   // Get city by ID
router.put('/:id', updateCity);    // Update city by ID
router.delete('/:id', deleteCity); // Delete city by ID
router.get('/all/c1', getAll);   

export default router;
