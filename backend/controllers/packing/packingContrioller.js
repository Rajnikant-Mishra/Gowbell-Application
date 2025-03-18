// ExamController.js
import packingModel from "../../models/packing/packingModel.js";

// Fetch exam_date by school and subject
export const fetchExamDate = (req, res) => {
  const { school, subject } = req.query;

  packingModel.fetchExamDateBySchoolAndSubject(
    school,
    subject,
    (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "Error fetching exam date", details: error });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({
            message: "No exams found for the given school and subject.",
          });
      }
      res
        .status(200)
        .json({ message: "Exam dates fetched successfully", data: results });
    }
  );
};

// Fetch school_code by school_name
export const getSchoolCodeByName = (req, res) => {
  const { school_name } = req.params; // Get school_name from request parameters

  packingModel.fetchSchoolCodeByName(school_name, (err, school_code) => {
    if (err) {
      console.error("Error fetching school code:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (!school_code) {
      return res
        .status(404)
        .json({ success: false, message: "School code not found" });
    }

    res.status(200).json({ success: true, school_code });
  });
};

// Create a new packing record
export const createPacking = (req, res) => {
  packingModel.createPacking(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ success: true, message: result.message });
  });
};

export const getAllPackings = (req, res) => {
  packingModel.getAllPackings((err, results) => {
    if (err) {
      console.error("Error fetching packings:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.status(200).json({ success: true, data: results });
  });
};

// Delete a packing record
export const deletePacking = (req, res) => {
  const { id } = req.params;
  packingModel.deletePacking(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: err });
    }
    res
      .status(200)
      .json({ success: true, message: "Packing record deleted successfully" });
  });
};
