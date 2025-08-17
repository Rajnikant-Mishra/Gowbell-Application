import Exam from "../../models/Exam/ExamModel.js";


// Helper to ensure value is an array
const ensureArray = (value) => Array.isArray(value) ? value : [value];

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map(v => (isNaN(v) ? v : Number(v)));
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(v => (isNaN(v) ? v : Number(v)));
      }
      return [isNaN(parsed) ? parsed : Number(parsed)];
    } catch {
      return [isNaN(value) ? value : Number(value)];
    }
  }
  if (value == null) return [];
  return [isNaN(value) ? value : Number(value)];
}

export const createExam = (req, res) => {
  const {
    school_id,
    classes_id,
    subjects_id,
    level,
    exam_date,
    country,
    state,
    district,
    city,
  } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  // Since frontend sends JSON strings, parse them to validate and pass as arrays
  let classesArray, subjectsArray;
  try {
    classesArray = JSON.parse(classes_id);
    subjectsArray = JSON.parse(subjects_id);
    if (!Array.isArray(classesArray) || !Array.isArray(subjectsArray)) {
      throw new Error("Invalid array format");
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Invalid classes or subjects format" });
  }

  Exam.create(
    {
      created_by: userId,
      school_id,
      classes_id: classesArray, // Pass parsed array
      subjects_id: subjectsArray, // Pass parsed array
      level,
      exam_date,
      country,
      state,
      district,
      city,
    },
    (err, result) => {
      if (err) {
        console.error("Exam creation error:", err);
        return res
          .status(500)
          .json({ error: "Failed to create exam", details: err.message });
      }
      res.status(201).json({
        message: "Exam created successfully",
        examId: result.insertId,
      });
    }
  );
};

//normalization array
export const getExams = (req, res) => {
  Exam.getAll((err, exams) => {
    if (err) {
      console.error("Fetch exams error:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch exams", details: err.message });
    }
    res.status(200).json(exams);
  });
};

//pagination and serch and get all
export const getExamswithpagination = (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  Exam.getAllwithpaginate(
    parseInt(page),
    parseInt(limit),
    search,
    (err, examsData) => {
      if (err) {
        console.error("Fetch exams error:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch exams", details: err.message });
      }
      res.status(200).json(examsData);
    }
  );
};

export const getExamById = (req, res) => {
  const id = req.params.id;

  Exam.getById(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching exam", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ data: result[0] });
  });
};


export const updateExam = (req, res) => {
  const examId = req.params.id;
  const userId = req.user?.id;

  const {
    school_id,
    classes_id,
    subjects_id,
    level,
    exam_date,
    country,
    state,
    district,
    city,
  } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  // Step 1: Verify exam ownership
  Exam.getById(examId, (err, exams) => {
    if (err) {
      console.error("Error fetching exam:", err);
      return res.status(500).json({ error: "Failed to fetch exam" });
    }

    if (exams.length === 0) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const exam = exams[0];
    if (exam.created_by !== userId) {
      return res.status(403).json({ error: "Forbidden. You are not the creator of this exam." });
    }

    // Step 2: Prepare normalized update data
    const updatedData = {
      created_by: userId,
      school_id,
      classes_id: normalizeArray(classes_id),
      subjects_id: normalizeArray(subjects_id),
      level,
      exam_date,
      country,
      state,
      district,
      city,
    };

    // Step 3: Perform update
    Exam.update(examId, updatedData, (updateErr) => {
      if (updateErr) {
        console.error("Update failed:", updateErr);
        return res.status(500).json({ error: "Failed to update exam" });
      }
      res.status(200).json({ message: "Exam updated successfully" });
    });
  });
};



export const deleteExam = (req, res) => {
  const { id } = req.params;

  Exam.delete(id, (err) => {
    if (err) {
      console.error("Exam deletion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete exam", details: err.message });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  });
};

//get exam date by school class , subjectexports.getExamsByMultipleClassesSubjects = (req, res) => {
export const getExamsBySchoolClassSubject = (req, res) => {
  const { school_id, class_id, subject_id } = req.query;

  // Debug
  console.log("Received query params:", req.query);

  if (!school_id || !class_id || !subject_id) {
    return res.status(400).json({
      error:
        "Missing required query parameters: school_id, class_id, subject_id",
    });
  }

  Exam.getBySchoolClassSubject(
    { school_id, class_id, subject_id },
    (err, results) => {
      if (err) {
        console.error("Error fetching exams:", err);
        return res.status(500).json({ error: "Failed to fetch exams" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No exams found" });
      }
      res.status(200).json(results);
    }
  );
};
