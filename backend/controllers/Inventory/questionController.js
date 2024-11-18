import { Question } from '../../models/Inventory/questionModel.js';

// Create a new question
export const createQuestion = (req, res) => {
  const { name, class_name, exam_level, quantity } = req.body;
  const newQuestion = { name, class_name, exam_level, quantity };

  Question.create(newQuestion, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Question created', questionId: result.insertId });
  });
};

// Get all questions
export const getAllQuestions = (req, res) => {
  Question.getAll((err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
};

// Get a single question by ID
export const getQuestionById = (req, res) => {
  const { id } = req.params;
  Question.getById(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('Question not found');
    res.status(200).send(result[0]);
  });
};

// Update a question by ID
export const updateQuestion = (req, res) => {
  const { id } = req.params;
  const { name, class_name, exam_level, quantity } = req.body;
  const updatedQuestion = { name, class_name, exam_level, quantity };

  Question.update(id, updatedQuestion, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Question not found');
    res.status(200).send({ message: 'Question updated' });
  });
};

// Delete a question by ID
export const deleteQuestion = (req, res) => {
  const { id } = req.params;
  Question.delete(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Question not found');
    res.status(200).send({ message: 'Question deleted' });
  });
};
