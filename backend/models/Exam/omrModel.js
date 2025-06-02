import { db } from "../../config/db.js";

const OmrData = {
  // Create new OMR record
  create: (data, callback) => {
    const query = `
      INSERT INTO omr_data (
        school,
        classes,
        subjects,
        country,
        state,
        district,
        city,
        level,
        students,
        mode,
        student_count,
        created_by,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        data.school,
        JSON.stringify(data.classes),
        JSON.stringify(data.subjects),
        data.country,
        data.state,
        data.district,
        data.city,
        data.level,
        data.students,
        data.mode,
        data.student_count,
        data.created_by,
        data.updated_by,
      ],
      callback
    );
  },

  getAll: (callback) => {
    const query = `
    SELECT * FROM omr_data ORDER BY created_at DESC
  `;
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = `SELECT * FROM omr_data WHERE id = ?`;
    db.query(query, [id], callback);
  },

  // Update record
  update: (id, data, callback) => {
    const query = `
      UPDATE omr_data SET
        school = ?, classes = ?, subjects = ?, country = ?, state = ?, district = ?,
        city = ?, level = ?, students = ?, mode = ?, student_count = ?, updated_by = ?
      WHERE id = ?
    `;
    db.query(
      query,
      [
        data.school,
        JSON.stringify(data.classes || []),
        JSON.stringify(data.subjects || []),
        data.country,
        data.state,
        data.district,
        data.city,
        data.level,
        data.students,
        data.mode,
        data.student_count,
        data.updated_by,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const query = `DELETE FROM omr_data WHERE id = ?`;

    db.query(query, [id], callback);
  },
};

export default OmrData;
