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
        mode,
        student_count,
        created_by,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        data.mode,
        data.student_count,
        data.created_by,
        data.updated_by
      ],
      callback
    );
  },
  
  

  getAll: (callback) => {
    const query = `
      SELECT 
        id,
        school,
        classes,
        subjects,
        country,
        state,
        district,
        city,
        level,
        mode,
        student_count,
        created_by,
        updated_by,
        created_at,
        updated_at
      FROM omr_data
    `;
  
    db.query(query, callback);
  },

  delete: (id, callback) => {
    const query = `DELETE FROM omr_data WHERE id = ?`;
  
    db.query(query, [id], callback);
  },
  
};

export default OmrData;
