import { db } from '../../config/db.js';

const Question = {
  create: (questionData, callback) => {
    const { name, class_name, exam_level, quantity } = questionData;
    const query = 'INSERT INTO questions (name, class_name, exam_level, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
    db.query(query, [name, class_name, exam_level, quantity], callback);
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM questions';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM questions WHERE id = ?';
    db.query(query, [id], callback);
  },

  update: (id, questionData, callback) => {
    const { name, class_name, exam_level, quantity } = questionData;
    const query = 'UPDATE questions SET name = ?, class_name = ?, exam_level = ?, quantity = ?, updated_at = NOW() WHERE id = ?';
    db.query(query, [name, class_name, exam_level, quantity, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM questions WHERE id = ?';
    db.query(query, [id], callback);
  }
};

export { Question };
