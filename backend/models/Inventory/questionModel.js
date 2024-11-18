import { db } from '../../config/db.js';

export const Question = {
  create: (questionData, callback) => {
    const {paper_name, class_name, exam_level, quantity} = questionData;
    const query = 'INSERT INTO question (paper_name, class_name, exam_level, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
    db.query(query, [paper_name, class_name, exam_level, quantity], callback);
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM question';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM question WHERE id = ?';
    db.query(query, [id], callback);
  },

  update: (id, bookData, callback) => {
    const {paper_name, class_name, exam_level, quantity } = bookData;
    const query = 'UPDATE question SET paper_name = ?, class_name = ?, exam_level = ?, quantity = ?, updated_at = NOW() WHERE id = ?';
    db.query(query, [paper_name, class_name, exam_level, quantity , id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM question WHERE id = ?';
    db.query(query, [id], callback);
  }
};

export default Question;
