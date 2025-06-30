import ResultModel from "../../models/Exam/ResultModel.js";

// Create a single result
export const createResult = (req, res) => {
  ResultModel.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(result);
  });
};

// Update
export const updateResult = (req, res) => {
  const id = req.params.id;
  ResultModel.update(id, req.body, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(200).json(result);
  });
};

// Get by ID
export const getResultById = (req, res) => {
  const id = req.params.id;
  ResultModel.getById(id, (err, result) => {
    if (err) return res.status(404).json({ error: err.message });
    res.status(200).json(result);
  });
};

export const bulkUploadResults = (req, res) => {
  const students = req.body.students; // Expecting an array of student result objects

  // Validate input
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid input: students array is required and cannot be empty.",
    });
  }

  // Call the bulkUpload method from the ResultModel
  ResultModel.bulkUpload(students, (err, response) => {
    if (err) {
      console.error("Error during bulk upload:", err); // Log the error for debugging
      return res.status(500).json({
        success: false,
        message: "Failed to upload results. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message: response.message,
    });
  });
};

// Get all results
export const getAllResults = (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  ResultModel.getAllResults(page, limit, (err, data) => {
    if (err) {
      return res.status(500).json({
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
      return res
        .status(500)
        .json({ error: "Internal server error", details: err });
    }
    res.json(result);
  });
};

// export const getFilteredStudentsomrreceipt = (req, res) => {
//   const { schoolName, classId, subjectId } = req.body;

//   if (!schoolName || !classId || !subjectId) {
//     return res.status(400).json({ error: "Invalid input data" });
//   }

//   ResultModel.getStudents(schoolName, classId, subjectId, (err, result) => {
//     if (err) {
//       console.error("Error fetching students:", err);
//       return res.status(500).json({ error: "Failed to fetch students" });
//     }

//     const { students, totalCount } = result;

//     ResultModel.getClassNames([classId], (err, classNames) => {
//       if (err) {
//         console.error("Error fetching class names:", err);
//         return res.status(500).json({ error: "Failed to fetch class names" });
//       }

//       ResultModel.getSubjectNames([subjectId], (err, subjectNames) => {
//         if (err) {
//           console.error("Error fetching subject names:", err);
//           return res
//             .status(500)
//             .json({ error: "Failed to fetch subject names" });
//         }

//         res.json({
//           students,
//           totalCount,
//           classNames,
//           subjectNames,
//         });
//       });
//     });
//   });
// };

export const getFilteredStudentsomrreceipt = (req, res) => {
  const { schoolName, classIds, subjectId } = req.body;

  // Validate inputs
  if (
    !schoolName ||
    !classIds ||
    !Array.isArray(classIds) ||
    classIds.length === 0 ||
    !subjectId
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid input data: schoolName, classIds (array), and subjectId are required",
      });
  }

  ResultModel.getStudents(schoolName, classIds, subjectId, (err, result) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ error: "Failed to fetch students" });
    }

    const { students, totalCount } = result;

    ResultModel.getClassNames(classIds, (err, classNames) => {
      if (err) {
        console.error("Error fetching class names:", err);
        return res.status(500).json({ error: "Failed to fetch class names" });
      }

      ResultModel.getSubjectNames([subjectId], (err, subjectNames) => {
        if (err) {
          console.error("Error fetching subject names:", err);
          return res
            .status(500)
            .json({ error: "Failed to fetch subject names" });
        }

        res.json({
          students,
          totalCount,
          classNames,
          subjectNames,
        });
      });
    });
  });
};

// Update percentages for pending students
export const updatePendingPercentages = (req, res) => {
  ResultModel.updatePendingPercentages((err, response) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message:
          "Error updating percentages, medals, levels, rank-based medals, and status for pending records",
        error: err.message,
      });
    }
    res.status(200).json({ success: true, message: response.message });
  });
};
