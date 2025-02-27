import {db} from "../../config/db.js";

const ExamChild = {
  createMany: (students, callback) => {
    const query = `
      INSERT INTO exam_child (exam_id, student_name, roll_number, class, full_mark, subject)
      VALUES ?`;
    const values = students.map(s => [s.exam_id, s.student_name, s.roll_number, s.class, s.full_mark, s.subject]);
    db.query(query, [values], callback);
  },

  getByExamCode: (exam_code, callback) => {
    const query = `SELECT * FROM exam_child WHERE exam_id=? ORDER BY roll_number`;
    db.query(query, [exam_code], callback);
  },

  deleteByExamCode: (exam_code, callback) => {
    const query = `DELETE FROM exam_child WHERE exam_id=?`;
    db.query(query, [exam_code], callback);
  }
};

export default ExamChild;
