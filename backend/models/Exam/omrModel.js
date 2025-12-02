import { db } from "../../config/db.js";

const OmrData = {
  // Create new OMR record

  // create: (data, callback) => {
  //   const query = `
  //   INSERT INTO omr_data (
  //     school,
  //     classes,
  //     subjects,
  //     center_id,
  //     country,
  //     state,
  //     district,
  //     city,
  //     level,
  //     students,
  //     mode,
  //     student_count,
  //     created_by,
  //     updated_by,
  //     filename,
  //     status,
  //     class_count,
  //     omr_set,
  //     exam_date
  //   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  // `;

  //   db.query(
  //     query,
  //     [
  //       data.school,
  //       JSON.stringify(data.classes),
  //       JSON.stringify(data.subjects),
  //       data.center_id,
  //       data.country,
  //       data.state,
  //       data.district,
  //       data.city,
  //       data.level,
  //       data.students,
  //       data.mode,
  //       data.student_count,
  //       data.created_by,
  //       data.updated_by,
  //       data.filename,
  //       data.status,
  //       data.class_count,
  //       data.omr_set, // NEW
  //       data.exam_date, // NEW
  //     ],
  //     callback
  //   );
  // },

  //===================
  create: (data, callback) => {
    const query = `
    INSERT INTO omr_data (
      school,
      classes,
      subjects,
      center_id,
      country,
      state,
      district,
      city,
      level,
      students,
      mode,
      student_count,
      created_by,
      updated_by,
      filename,
      status,
      class_count,
      omr_set,
      exam_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(
      query,
      [
        JSON.stringify(data.school), // ✅ store multi-school as JSON
        JSON.stringify(data.classes),
        JSON.stringify(data.subjects),
        data.center_id,
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
        data.filename,
        data.status,
        data.class_count,
        data.omr_set,
        data.exam_date,
      ],
      callback
    );
  },


//============
  getAll: (callback) => {
    const query = `
    SELECT 
      o.id,
      o.created_at,
      o.school AS school_id,
      o.classes,
      o.subjects,
      o.level,
      o.student_count,
      o.filename,
      o.status,
      c.name   AS country,
      s.name   AS state,
      d.name   AS district,
      ci.name  AS city
    FROM omr_data o
    LEFT JOIN countries  c  ON o.country  = c.id
    LEFT JOIN states     s  ON o.state    = s.id
    LEFT JOIN districts  d  ON o.district = d.id
    LEFT JOIN cities     ci ON o.city     = ci.id
    ORDER BY o.created_at DESC
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

  //filenameupdat
  // updateFilename: (id, filename, updated_by, callback) => {
  //   const query = `
  //     UPDATE omr_data SET filename = ?, updated_by = ? WHERE id = ?
  //   `;
  //   db.query(query, [filename, updated_by, id], callback);
  // },
  updateFilename: (id, filename, updated_by, callback) => {
    const query = `
    UPDATE omr_data 
    SET filename = ?, updated_by = ?, status = 'Active' 
    WHERE id = ?
  `;
    db.query(query, [filename, updated_by, id], callback);
  },

  // New function to get filename by ID for download
  getFilenameById: (id, callback) => {
    const query = "SELECT filename FROM omr_data WHERE id = ?";
    db.query(query, [id], callback);
  },

  // ✅ Get classes for given school and subject
  getClassesAndOmrSetBySchoolAndSubject: (school, subject, callback) => {
    const query = `
    SELECT DISTINCT classes, omr_set, class_count
    FROM omr_data
    WHERE school = ?
      AND JSON_CONTAINS(subjects, JSON_QUOTE(?))
  `;

    db.query(query, [school, subject], callback);
  },
};

export default OmrData;
