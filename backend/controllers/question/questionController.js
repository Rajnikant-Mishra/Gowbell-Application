import {QuestionModel}  from "../../models/question/questionModel.js";

export const getAllQuestions = (req, res) => {
  QuestionModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getQuestionById = (req, res) => {
  const id = req.params.id;
  QuestionModel.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

export const createQuestion = (req, res) => {
  const data = req.body;
  QuestionModel.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Question created", id: result.insertId });
  });
};

export const updateQuestion = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  QuestionModel.update(id, data, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Question updated" });
  });
};

export const deleteQuestion = (req, res) => {
  const id = req.params.id;
  QuestionModel.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Question deleted" });
  });
};
