import express from 'express';
import { createInventory, getInventory, getInventoryById, updateInventory, deleteInventory } from '../../controllers/inventory/inventoryController.js';

const router = express.Router();

// Route to create a new inventory item
router.post('/inventory', createInventory);

// Route to get all inventory items
router.get('/inventory', getInventory);

// Route to get a specific inventory item by item_id
router.get('/inventory/:id', getInventoryById);

// Route to update an inventory item by item_id
router.put('/inventory/:id', updateInventory);

// Route to delete an inventory item by item_id
router.delete('/inventory/:id', deleteInventory);

export default router;
