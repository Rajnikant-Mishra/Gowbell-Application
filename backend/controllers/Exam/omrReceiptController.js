// controllers/Exam/omrReceiptController.js
import OmrReceipt from "../../models/Exam/omrReceiptModel.js";

export const bulkUpload = (req, res) => {
  const rows = req.body.rows;

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid or empty upload data",
    });
  }

  OmrReceipt.bulkUpload(rows, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bulk upload finished",
      inserted: result.inserted,
      errors: result.errors,
    });
  });
};
