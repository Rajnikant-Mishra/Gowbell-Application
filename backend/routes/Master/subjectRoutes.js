import  express from 'express';

import  {createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject} from '../../controllers/Master/subjectController.js';


const router = express.Router();



router.post('/subject', createSubject);
router.get('/subject', getAllSubjects);
router.get('/subject/:id', getSubjectById);
router.put('/subject/:id', updateSubject);
router.delete('/subject/:id', deleteSubject);

export default router;
