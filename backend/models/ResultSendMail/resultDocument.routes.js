// routes/resultDocument.routes.js

import express from "express";
import upload from "../../middleware/resultdocumnet.js";
import { createResultDocument } from "../ResultSendMail/resultDocument.controller.js";

const router = express.Router();

router.post(
  "/upload-result",
  upload.array("pdfs", 10), //multiple PDFs
  createResultDocument
);

export default router;