import express from 'express';
import { createFee, getAllFees, getAll, getFeeById, updateFee, deleteFee } from '../../controllers/Master/feeController.js';

const router = express.Router();

router.post('/create', createFee);
router.get('/get-all', getAllFees);
router.get('/fee-paginate', getAll);
router.get('/:id', getFeeById);
router.put('/:id', updateFee);
router.delete('/:id', deleteFee);

export default router;
