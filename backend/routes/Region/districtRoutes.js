// routes/districtRoutes.js
import  express from 'express';
import  {createDistrict, getAllDistricts, getDistrictById, updateDistrict, deleteDistrict} from '../../controllers/Region/districtController.js';

const router = express.Router();


router.post('/', createDistrict);      // Create a new district
router.get('/', getAllDistricts);      // Get all districts
router.get('/:id', getDistrictById);   // Get district by ID
router.put('/:id', updateDistrict);    // Update district by ID
router.delete('/:id', deleteDistrict); // Delete district by ID

export default router;
