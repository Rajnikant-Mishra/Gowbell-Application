import express from "express";
import {
  createOmr,
  getAllOmrData,
  getOmrById,
  updateOmr,
  deleteOmrData,
  downloadOmrById,
  updateOmrFilename,
  getClassesAndOmrSetBySchoolAndSubject,
} from "../../controllers/Exam/omrController.js";
import { upload } from "../../middleware/multer.js";
const router = express.Router();

// router.post('/generator', createOmr);
// Upload PDF + JSON OMR data
router.post("/generator", upload.single("pdf"), createOmr);

// Route to get student data by roll number
router.get("/omr-data", getAllOmrData);

// Get specific OMR entry by ID along with matching students
router.get("/get/:id", getOmrById);

//update
router.put("/update/:id", updateOmr);

// Delete OMR data by ID
router.delete("/omr-data/:id", deleteOmrData);

// Update filename for an OMR record
router.put("/omr/filename/:id", upload.single("pdf"), updateOmrFilename);

router.get("/download/by-id/:id", downloadOmrById);

// Route: GET /api/omr/classes-omrset?school=XYZ&subject=Math
router.get("/omr-data/classes",  getClassesAndOmrSetBySchoolAndSubject);

export default router;
