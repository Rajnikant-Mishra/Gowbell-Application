import ResultModel from "../../models/Exam/ResultModel.js";

export const bulkUploadResults = (req, res) => {
  const students = req.body.students; // Expecting an array of student result objects

  ResultModel.bulkUpload(students, (err, response) => {
    if (err) return res.status(500).json({ success: false, message: err });
    res.status(200).json({ success: true, message: response.message });
  });
};

// Get all results
export const getAllResults = (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  ResultModel.getAllResults(page, limit, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Error fetching results",
          error: err.message,
        });
    }
    res.status(200).json({ success: true, ...data });
  });
};

// Delete by ID
export const deleteResultById = (req, res) => {
  const id = req.params.id;

  ResultModel.deleteById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error", details: err });
    }
    res.json(result);
  });
};

// Update percentages for pending students
export const updatePendingPercentages = (req, res) => {
  ResultModel.updatePendingPercentages((err, response) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error updating percentages, medals, levels, rank-based medals, and status for pending records",
        error: err.message,
      });
    }
    res.status(200).json({ success: true, message: response.message });
  });
};
