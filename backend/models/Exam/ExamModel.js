import { db } from "../../config/db.js";

const ExamParent = {
  create: (examData, callback) => {
    const {
      created_by,
      school,
      classes,
      subjects,
      level,
      exam_date,
      country,
      state,
      district,
      city,
    } = examData;

    // Ensure classes and subjects are properly formatted arrays
    const classesArray = ensureArray(classes);
    const subjectsArray = ensureArray(subjects);

    const query = `
      INSERT INTO exam (
        created_by, 
        school, 
        classes, 
        subjects, 
        level, 
        exam_date, 
        country,
        state,
        district,
        city,
        created_at, 
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    db.query(
      query,
      [
        created_by,
        school,
        JSON.stringify(classesArray),
        JSON.stringify(subjectsArray),
        level,
        exam_date,
        country,
        state,
        district,
        city,
      ],
      callback
    );
  },

  // getAll: (callback) => {
  //   const query = `SELECT 
  //                   id,
  //                   created_by,
  //                   school,
  //                   classes,
  //                   subjects,
  //                   level,
  //                   exam_date,
  //                   country,
  //                   state,
  //                   district,
  //                   city,
  //                   created_at,
  //                   updated_at,
  //                   updated_by
  //                 FROM exam 
  //                 ORDER BY exam_date DESC`;

  //   db.query(query, (err, results) => {
  //     if (err) return callback(err);

  //     const parsedResults = results.map((row) => ({
  //       ...row,
  //       classes: safeJsonParse(row.classes),
  //       subjects: safeJsonParse(row.subjects),
  //     }));

  //     callback(null, parsedResults);
  //   });
  // },
  getAll: (callback) => {
    const query = `
        SELECT 
            e.id,
            e.created_by,
            e.school,
            e.classes,
            e.subjects,
            e.level,
            e.exam_date,
            e.country AS country_id,
            c1.name AS country_name,
            e.state AS state_id,
            s1.name AS state_name,
            e.district AS district_id,
            d.name AS district_name,
            e.city AS city_id,
            c2.name AS city_name,
            e.created_at,
            e.updated_at,
            e.updated_by
        FROM exam e
        LEFT JOIN countries c1 ON e.country = c1.id
        LEFT JOIN states s1 ON e.state = s1.id
        LEFT JOIN districts d ON e.district = d.id
        LEFT JOIN cities c2 ON e.city = c2.id
        ORDER BY e.exam_date DESC;
    `;

    db.query(query, (err, results) => {
        if (err) return callback(err);

        const parsedResults = results.map((row) => ({
            ...row,
            classes: safeJsonParse(row.classes),
            subjects: safeJsonParse(row.subjects),
        }));

        callback(null, parsedResults);
    });
},


  update: (id, examData, updated_by, callback) => {
    const {
      school,
      classes,
      subjects,
      level,
      exam_date,
      country,
      state,
      district,
      city,
    } = examData;

    // Ensure classes and subjects are properly formatted arrays
    const classesArray = ensureArray(classes);
    const subjectsArray = ensureArray(subjects);

    const query = `
      UPDATE exam 
      SET 
        school = ?, 
        classes = ?, 
        subjects = ?, 
        level = ?, 
        exam_date = ?,
        country = ?,
        state = ?,
        district = ?,
        city = ?,
        updated_at = NOW(),
        updated_by = ?
      WHERE id = ?`;

    db.query(
      query,
      [
        school,
        JSON.stringify(classesArray),
        JSON.stringify(subjectsArray),
        level,
        exam_date,
        country,
        state,
        district,
        city,
        updated_by,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const query = `DELETE FROM exam WHERE id = ?`;
    db.query(query, [id], callback);
  },
};

// Helper functions
function ensureArray(data) {
  if (Array.isArray(data)) return data;
  if (typeof data === "string" && data.includes(","))
    return data.split(",").map((item) => item.trim());
  return [data];
}

function safeJsonParse(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    if (typeof jsonString === "string" && jsonString.includes(",")) {
      return jsonString.split(",").map((item) => item.trim());
    }
    return [jsonString];
  }
}

export default ExamParent;
