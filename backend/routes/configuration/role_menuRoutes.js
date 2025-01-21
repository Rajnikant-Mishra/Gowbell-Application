import express from 'express';
import {
    assignMenu,
    getMenusByRole,
    removeMenu,
    getAllRoleMenus
} from '../../controllers/configuration/role_menuController.js';

const router = express.Router();

router.post('/assign', assignMenu);
router.get('/:role_id', getMenusByRole);
router.delete('/remove', removeMenu);
router.get('/', getAllRoleMenus);

export default router;
