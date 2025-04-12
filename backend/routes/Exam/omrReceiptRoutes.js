import  express from 'express';
const router = express.Router();
import  {getAllReceipts, getReceiptById, createReceipt,  updateReceipt,  deleteReceipt} from '../../controllers/Exam/omrReceiptController.js';

router.get('/get-omrreceipt', getAllReceipts);
router.get('/:id', getReceiptById);
router.post('/omr-receipt', createReceipt);
router.put('/:id', updateReceipt);
router.delete('/:id', deleteReceipt);

export default router;
