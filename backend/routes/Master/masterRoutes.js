import express from 'express';

import {createMaster, getAllMasters, getMasterById, updateMaster, deleteMaster} from '../../controllers/Master/masterController.js';

const router = express.Router();



router.post('/master', createMaster);
router.get('/master', getAllMasters);
router.get('/master/:id', getMasterById);
router.put('/master/:id', updateMaster);
router.delete('/master/:id', deleteMaster);

export default router;
