import express from 'express';

import {createClass, getAllClasses, getClassById, updateClass, deleteClass} from '../../controllers/Master/classController.js';


const router = express.Router();

router.post('/class', createClass);
router.get('/class', getAllClasses);
router.get('/class/:id', getClassById);
router.put('/class/:id', updateClass);
router.delete('/class/:id', deleteClass);

export default router;
