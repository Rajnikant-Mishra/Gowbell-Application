import  express from 'express';
const router = express.Router();
import  {bulkUpload} from '../../controllers/Exam/omrReceiptController.js';


// ✅ Update staff for a specific OMR record
router.post("/bulk-upload", bulkUpload);



export default router;
