import  express from 'express';

import  {createOmr, getAllOmr, getOmrById, updateOmr, deleteOmr} from '../../controllers/Inventory/omrController.js';

const router = express.Router();



router.post('/omr', createOmr);

router.get('/omr', getAllOmr);

router.get('/omr/:id', getOmrById);

router.put('/omr/:id', updateOmr);

router.delete('/omr/:id', deleteOmr);


export default router;
