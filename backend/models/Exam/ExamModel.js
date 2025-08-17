import { db } from "../../config/db.js";

const ExamParent = {
  // Utility function to ensure input is an array
  ensureArray: (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return Array.isArray(input) ? input : [];
    }
  },

  // Exam model
  create: (examData, callback) => {
    const {
      created_by,
      school_id,
      classes_id,
      subjects_id,
      level,
      exam_date,
      country,
      state,
      district,
      city,
    } = examData;

    // Ensure classes and subjects are arrays
    const classesArray = ensureArray(classes_id);
    const subjectsArray = ensureArray(subjects_id);

    const query = `
      INSERT INTO exam (
        created_by, 
        school_id, 
        classes_id, 
        subjects_id, 
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
        school_id,
        JSON.stringify(classesArray), // Explicitly stringify to ensure single value
        JSON.stringify(subjectsArray), // Explicitly stringify to ensure single value
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

  getAll: (callback) => {
    const query = `
        SELECT 
            e.id,
            e.created_by,
            e.school_id,
            e.classes_id,
            e.subjects_id,
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

  //pagination and serch and get all

  getAllwithpaginate: (page = 1, limit = 10, search = "", callback) => {
    const offset = (page - 1) * limit;
    let whereClause = "";
    let queryParams = [];

    if (search && search.trim() !== "") {
      whereClause = `
      WHERE 
        e.school_id LIKE ? OR 
        e.level LIKE ? OR 
        e.classes_id LIKE ? OR 
        e.subjects_id LIKE ?
    `;
      for (let i = 0; i < 4; i++) queryParams.push(`%${search}%`);
    }

    const dataQuery = `
    SELECT 
      e.id,
      e.created_by,
      e.school_id,
      sch.school_name AS school_name,
      e.classes_id,
      e.subjects_id,
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
    LEFT JOIN school sch ON e.school_id = sch.id
    LEFT JOIN countries c1 ON e.country = c1.id
    LEFT JOIN states s1 ON e.state = s1.id
    LEFT JOIN districts d ON e.district = d.id
    LEFT JOIN cities c2 ON e.city = c2.id
    ${whereClause}
    ORDER BY e.exam_date DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM exam e
    ${whereClause};
  `;

    // Step 1: Get total count for pagination
    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      // Step 2: Get main exam records
      db.query(
        dataQuery,
        [...queryParams, parseInt(limit), parseInt(offset)],
        async (err, results) => {
          if (err) return callback(err);

          try {
            // Step 3: Fetch all class and subject names
            const [classRows] = await db
              .promise()
              .query("SELECT id, name FROM class");
            const [subjectRows] = await db
              .promise()
              .query("SELECT id, name FROM subject_master");

            const classMap = {};
            classRows.forEach((cls) => {
              classMap[cls.id] = cls.name;
            });

            const subjectMap = {};
            subjectRows.forEach((sub) => {
              subjectMap[sub.id] = sub.name;
            });

            // Step 4: Resolve names in JS
            results.forEach((exam) => {
              const classIds = Array.isArray(exam.classes_id)
                ? exam.classes_id
                : JSON.parse(exam.classes_id || "[]");

              const subjectIds = Array.isArray(exam.subjects_id)
                ? exam.subjects_id
                : JSON.parse(exam.subjects_id || "[]");

              exam.class_name = classIds.map(
                (id) => classMap[id] || `Class ${id}`
              );
              exam.subject_name = subjectIds.map(
                (id) => subjectMap[id] || `Subject ${id}`
              );
            });

            // Step 5: Final response
            callback(null, {
              exams: results,
              currentPage: page,
              nextPage,
              prevPage,
              totalPages,
              totalRecords,
            });
          } catch (err) {
            callback(err);
          }
        }
      );
    });
  },

  getById: (id, callback) => {
    const query = "SELECT * FROM exam WHERE id = ?";
    db.query(query, [id], callback);
  },

  update: (id, examData, callback) => {
    const {
      created_by,
      school_id,
      classes_id,
      subjects_id,
      level,
      exam_date,
      country,
      state,
      district,
      city,
    } = examData;

    const query = `
    UPDATE exam SET 
      created_by = ?, 
      school_id = ?, 
      classes_id = ?, 
      subjects_id = ?, 
      level = ?, 
      exam_date = ?, 
      country = ?,
      state = ?, 
      district = ?, 
      city = ?, 
      updated_at = NOW()
    WHERE id = ?
  `;

    db.query(
      query,
      [
        created_by,
        school_id,
        JSON.stringify(classes_id), // already normalized as numbers
        JSON.stringify(subjects_id),
        level,
        exam_date,
        country,
        state,
        district,
        city,
        id,
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const query = `DELETE FROM exam WHERE id = ?`;
    db.query(query, [id], callback);
  },

  //get exam data by school, classes, subjects,
  getBySchoolClassSubject: ({ school_id, class_id, subject_id }, callback) => {
    const query = `
      SELECT * FROM exam 
      WHERE school_id = ? 
      AND JSON_CONTAINS(classes_id, ?) 
      AND JSON_CONTAINS(subjects_id, ?)
    `;
    db.query(
      query,
      [school_id, JSON.stringify([class_id]), JSON.stringify([subject_id])],
      callback
    );
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
