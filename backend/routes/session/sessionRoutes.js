import express from 'express';
import { getAllSessions, getSessionById , createSession, updateSession, deleteSession } from '../../controllers/session/sessionController.js';

const router = express.Router();

router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;
