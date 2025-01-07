import  examModel from '../../models/Exam/ExamModel.js';

// Create an exam
export const createExam = (req, res) => {
  const examData = req.body;
  examModel.createExam(examData, (error, result) => {
    if (error) {
      res.status(500).send({ message: 'Error creating exam', error });
    } else {
      res.status(201).send({ message: 'Exam created successfully', result });
    }
  });
};

// Get all exams

export  const getExams = (req, res) => {
  examModel.getExams((error, results) => {
    if (error) {
      res.status(500).send({ message: 'Error fetching exams', error });
    } else {
      res.status(200).send(results);
    }
  });
};

// Get exam by ID

export  const getExamById = (req, res) => {
  const { id } = req.params;
  examModel.getExamById(id, (error, result) => {
    if (error) {
      res.status(500).send({ message: 'Error fetching exam', error });
    } else if (result.length === 0) {
      res.status(404).send({ message: 'Exam not found' });
    } else {
      res.status(200).send(result);
    }
  });
};

// Update an exam

export  const updateExam = (req, res) => {
  const { id } = req.params;
  const examData = req.body;
  examModel.updateExam(id, examData, (error, result) => {
    if (error) {
      res.status(500).send({ message: 'Error updating exam', error });
    } else {
      res.status(200).send({ message: 'Exam updated successfully', result });
    }
  });
};

// Delete an exam

export const deleteExam = (req, res) => {
  const { id } = req.params;
  examModel.deleteExam(id, (error, result) => {
    if (error) {
      res.status(500).send({ message: 'Error deleting exam', error });
    } else {
      res.status(200).send({ message: 'Exam deleted successfully', result });
    }
  });
};


