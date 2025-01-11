
import QuestionCo  from '../../models/Exam/questionCoModel.js';

export  const getAllQuestions = (req, res) => {
  QuestionCo.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

export  const getQuestionById = (req, res) => {
  const id = req.params.id;
  QuestionCo.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Question not found." });
    res.status(200).json(results[0]);
  });
};

export  const createQuestion = (req, res) => {
  const { question_name, exam_date, school_name_co, tracking_no, quantity_co } = req.body;

  // Validation
  if (!question_name || !exam_date || !school_name_co || !tracking_no || !quantity_co) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const data = { question_name, exam_date, school_name_co, tracking_no, quantity_co };
  QuestionCo.create(data, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Question created successfully.", id: results.insertId });
  });
};

export  const updateQuestion = (req, res) => {
  const id = req.params.id;
  const { question_name, exam_date, school_name_co, tracking_no, quantity_co } = req.body;

  // Validation
  if (!question_name || !exam_date || !school_name_co || !tracking_no || !quantity_co) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const data = { question_name, exam_date, school_name_co, tracking_no, quantity_co };
  QuestionCo.update(id, data, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Question updated successfully." });
  });
};

export const deleteQuestion = (req, res) => {
  const id = req.params.id;
  QuestionCo.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Question deleted successfully." });
  });
};

