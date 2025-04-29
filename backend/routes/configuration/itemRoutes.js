import express from 'express';
const router = express.Router();
import {getAllItems, getItemById, createItem, updateItem, deleteItem} from '../../controllers/configuration/itemController.js';


router.post('/create', createItem);
router.get('/items', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/delete/:id', deleteItem);

export default router;
