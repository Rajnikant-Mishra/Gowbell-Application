// routes/roles.routes.js
import  express from 'express';
const router = express.Router();
import  {createRole, getAllRoles, getRoleById, updateRole, deleteRole} from '../../controllers/Role/roleController.js';

// Create a new role
router.post('/role', createRole);

// Get all roles
router.get('/role', getAllRoles);

// Get a role by its ID
router.get('/role/:id', getRoleById);

// Update a role by its ID
router.put('/role/:id', updateRole);

// Delete a role by its ID
router.delete('/role/:id', deleteRole);

export default router;
