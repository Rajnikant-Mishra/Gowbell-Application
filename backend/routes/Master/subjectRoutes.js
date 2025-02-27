import  express from 'express';

import  {createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject} from '../../controllers/Master/subjectController.js';
import { authenticateToken  } from "../../middleware/verifyToken.js";

const router = express.Router();



router.post('/subject',authenticateToken , createSubject);
router.get('/subject', getAllSubjects);
router.get('/subject/:id', getSubjectById);
router.put('/subject/:id', updateSubject);
router.delete('/subject/:id', deleteSubject);

export default router;
