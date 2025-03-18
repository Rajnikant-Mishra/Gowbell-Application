import express from 'express';
import { createOmr } from '../../controllers/Exam/omrController.js';

const router = express.Router();

router.post('/generator', createOmr);


export default router;
