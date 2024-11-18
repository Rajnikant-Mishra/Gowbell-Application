// routes/countryRoutes.js
import express from 'express';


import { createCountry, getAllCountries, getCountryById, updateCountry, deleteCountry } from "../../controllers/Region/countryController.js";


const router = express.Router();

router.post('/', createCountry);
router.get('/', getAllCountries);
router.get('/:id', getCountryById);
router.put('/:id', updateCountry);
router.delete('/:id', deleteCountry);


export default router;