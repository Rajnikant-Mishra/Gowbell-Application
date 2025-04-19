import express from 'express';
import {
    assignMenu,
    getMenusByRole,
   
    getAllRoleMenu,
    deleteRoleMenu
   
} from '../../controllers/configuration/role_menuController.js';

const router = express.Router();


router.post('/permission/assign', assignMenu);
router.get('/permission/:role_id', getMenusByRole);
router.get('/permission/menu/raw', getAllRoleMenu); 
// Delete a consignment by ID
router.delete('/permission/assign/:id', deleteRoleMenu);

export default router;
