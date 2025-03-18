import { db } from "../../config/db.js";

const ExamParent = {
  create: (examData, callback) => {
    const {
      exam_code,
      created_by,
      school,
      class_name,
      subject,
      level,
      exam_date,
    } = examData;
    const query = `
      INSERT INTO exam_parent (exam_code, created_by, school, class, subject, level, exam_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(
      query,
      [exam_code, created_by, school, class_name, subject, level, exam_date],
      callback
    );
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
    db.query(
      query,
      [school, class_name, subject, level, exam_date, exam_code],
      callback
    );
  },

  delete: (exam_code, callback) => {
    const query = `DELETE FROM exam_parent WHERE id=?`;
    db.query(query, [exam_code], callback);
  },

  getAllWithStudents: (callback) => {
    const query = `
      SELECT 
        ep.id AS exam_id,
        ep.exam_code,
        ep.created_by,
        ep.school,
        ep.class AS class_name,
        ep.subject,
        ep.level,
        ep.exam_date,
        ep.created_at,
        ep.updated_at,
        ec.id AS student_id,
        ec.student_name,
        ec.roll_number,
        ec.class AS student_class,
        ec.full_mark,
        ec.subject AS student_subject,
        COUNT(ec.id) AS student_count
      FROM 
        exam_parent ep
      LEFT JOIN 
        exam_child ec ON ep.id = ec.exam_id
      GROUP BY 
        ep.id, ec.id
      ORDER BY 
        ep.exam_date DESC;
    `;
    db.query(query, callback);
  },
};

export default ExamParent;
