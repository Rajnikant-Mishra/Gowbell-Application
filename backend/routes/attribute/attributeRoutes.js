import express from 'express';

import {createAttribute, getAllAttributes, getAttributeById , updateAttribute, deleteAttribute,getItemAttributeValues} from '../../controllers/attribute/attributeController.js';

const router = express.Router();

router.post("/attributes", createAttribute);
router.get("/attributes", getAllAttributes);
router.get("/attributes/:id", getAttributeById);
router.put("/attributes/:id", updateAttribute);
router.delete("/attributes/:id", deleteAttribute);

// Get only 'cvalue' where attribute_name is 'item'
router.get("/attributes/item/cvalues", getItemAttributeValues);
export default router;
