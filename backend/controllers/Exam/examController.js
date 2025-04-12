import Exam from "../../models/Exam/ExamModel.js";

export const createExam = (req, res) => {
  const { 
    school, 
    classes, 
    subjects, 
    level, 
    exam_date,
    country,
    state,
    district,
    city
  } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  Exam.create(
    {
      created_by: userId,
      school,
      classes,
      subjects,
      level,
      exam_date,
      country,
      state,
      district,
      city
    },
    (err, result) => {
      if (err) {
        console.error("Exam creation error:", err);
        return res.status(500).json({ error: "Failed to create exam", details: err.message });
      }
      res.status(201).json({ 
        message: "Exam created successfully",
        examId: result.insertId 
      });
    }
  );
};

export const getExams = (req, res) => {
  Exam.getAll((err, exams) => {
    if (err) {
      console.error("Fetch exams error:", err);
      return res.status(500).json({ error: "Failed to fetch exams", details: err.message });
    }
    res.status(200).json(exams);
  });
};

export const updateExam = (req, res) => {
  const { id } = req.params;
  const { 
    school, 
    classes, 
    subjects, 
    level, 
    exam_date,
    country,
    state,
    district,
    city
  } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  Exam.update(
    id,
    { 
      school, 
      classes, 
      subjects, 
      level, 
      exam_date,
      country,
      state,
      district,
      city
    },
    userId,
    (err) => {
      if (err) {
        console.error("Exam update error:", err);
        return res.status(500).json({ error: "Failed to update exam", details: err.message });
      }
      res.status(200).json({ message: "Exam updated successfully" });
    }
  );
};

export const deleteExam = (req, res) => {
  const { id } = req.params;

  Exam.delete(id, (err) => {
    if (err) {
      console.error("Exam deletion error:", err);
      return res.status(500).json({ error: "Failed to delete exam", details: err.message });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  });
};