import express from 'express';
import { createAffiliated, getAllAffiliated, getAffiliatedById, updateAffiliated, deleteAffiliated } from '../../controllers/Master/affiliatedController.js';
import { authenticateToken  } from "../../middleware/verifyToken.js";
const router = express.Router();

router.post('/affiliated',authenticateToken , createAffiliated);
router.get('/affiliated', getAllAffiliated);
router.get('/affiliated/:id', getAffiliatedById);
router.put('/affiliated/:id', updateAffiliated);
router.delete('/affiliated/:id', deleteAffiliated);

export default router;
