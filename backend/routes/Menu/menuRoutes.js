import express from 'express';
import {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} from '../../controllers/Menu/menuController.js';

const router = express.Router();

// Route to create a new menu
router.post('/menu', createMenu);

// Route to get all menus
router.get('/menu', getAllMenus);

// Route to get a specific menu by ID
router.get('/menu/:id', getMenuById);

// Route to update a menu by ID
router.put('/menu/:id', updateMenu);

// Route to delete a menu by ID
router.delete('/menu/:id', deleteMenu);

export default router;
