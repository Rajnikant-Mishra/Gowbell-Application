import { db } from '../../config/db.js';

export const QuestionCo = {
  getAll: (callback) => {
    const sql = "SELECT * FROM question_co";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM question_co WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO question_co (question_name, exam_date, school_name_co, tracking_no, quantity_co)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [data.question_name, data.exam_date, data.school_name_co, data.tracking_no, data.quantity_co], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE question_co
      SET question_name = ?, exam_date = ?, school_name_co = ?, tracking_no = ?, quantity_co = ?
      WHERE id = ?
    `;
    db.query(sql, [data.question_name, data.exam_date, data.school_name_co, data.tracking_no, data.quantity_co, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM question_co WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

export default QuestionCo;
