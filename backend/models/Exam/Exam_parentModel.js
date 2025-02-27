import {db} from "../../config/db.js";

const ExamParent = {
  create: (examData, callback) => {
    const { exam_code, school, class_name, subject, level, exam_date } = examData;
    const query = `
      INSERT INTO exam_parent (exam_code, school, class, subject, level, exam_date)
      VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [exam_code, school, class_name, subject, level, exam_date], callback);
  },

  getAll: (callback) => {
    const query = `SELECT * FROM exam_parent ORDER BY exam_date DESC`;
    db.query(query, callback);
  },

  update: (exam_code, examData, callback) => {
    const { school, class_name, subject, level, exam_date } = examData;
    const query = `
      UPDATE exam_parent 
      SET school=?, class=?, subject=?, level=?, exam_date=?
      WHERE id=?`;
    db.query(query, [school, class_name, subject, level, exam_date, exam_code], callback);
  },

  delete: (exam_code, callback) => {
    const query = `DELETE FROM exam_parent WHERE id=?`;
    db.query(query, [exam_code], callback);
  }
};

export default ExamParent;
