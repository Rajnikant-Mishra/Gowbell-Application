import { db } from "../../config/db.js";




const safeParseIds = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "number") return [value];

  if (typeof value === "string") {
    // JSON array string
    if (value.trim().startsWith("[")) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }

    // Comma-separated string
    return value
      .split(",")
      .map((v) => Number(v.trim()))
      .filter(Boolean);
  }

  return [];
};

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
      school_id, // Now can be string or array
      classes_id,
      subjects_id,
      level,
      exam_date,
      country,
      state,
      district,
      city,
      session_id,
    } = examData;

    // Convert to arrays
    const schoolArray = ensureArray(school_id);
    const classesArray = ensureArray(classes_id);
    const subjectsArray = ensureArray(subjects_id);

    // Step 1: Resolve session_id dynamically
    const resolveSessionId = (next) => {
      if (session_id) {
        const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
        db.query(verifyQuery, [session_id], (err, result) => {
          if (err) return callback(err, null);
          if (result.length === 0)
            return callback(new Error("Invalid session ID selected"), null);
          return next(session_id);
        });
      } else {
        const sessionQuery = `
        SELECT id FROM gowvell_session 
        WHERE status = 'active' 
        ORDER BY id DESC LIMIT 1
      `;
        db.query(sessionQuery, (err, results) => {
          if (err) return callback(err, null);
          if (results.length === 0)
            return callback(new Error("No active session found"), null);
          return next(results[0].id);
        });
      }
    };

    // Step 2: Insert exam with JSON arrays
    resolveSessionId((finalSessionId) => {
      const insertQuery = `
      INSERT INTO exam (
        session_id,
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

      db.query(
        insertQuery,
        [
          finalSessionId,
          created_by,
          JSON.stringify(schoolArray), // ← JSON string
          JSON.stringify(classesArray), // ← JSON string
          JSON.stringify(subjectsArray), // ← JSON string
          level,
          exam_date,
          country,
          state,
          district,
          city,
        ],
        callback,
      );
    });
  },

  //get all
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
  // getAllwithpaginate: (
  //   page = 1,
  //   limit = 10,
  //   search = "",
  //   session_id = null,
  //   callback,
  // ) => {
  //   const offset = (page - 1) * limit;

  //   let whereClause = "";
  //   let queryParams = [];

  //   // --- Session filter ---
  //   if (session_id) {
  //     whereClause = "WHERE e.session_id = ?";
  //     queryParams.push(session_id);
  //   } else {
  //     whereClause = "WHERE gs.status = 'active'";
  //   }

  //   // --- Search filter ---
  //   if (search && search.trim() !== "") {
  //     whereClause += `
  //     AND (
  //       e.school_id LIKE ? OR
  //       e.level LIKE ? OR
  //       e.classes_id LIKE ? OR
  //       e.subjects_id LIKE ?
  //     )
  //   `;
  //     for (let i = 0; i < 4; i++) queryParams.push(`%${search}%`);
  //   }

  //   const dataQuery = `
  //   SELECT
  //     e.id,
  //     e.created_by,
  //     e.school_id,
  //     e.classes_id,
  //     e.subjects_id,
  //     e.level,
  //     e.exam_date,
  //     e.country AS country_id,
  //     c1.name AS country_name,
  //     e.state AS state_id,
  //     s1.name AS state_name,
  //     e.district AS district_id,
  //     d.name AS district_name,
  //     e.city AS city_id,
  //     c2.name AS city_name,
  //     e.created_at,
  //     e.updated_at,
  //     e.updated_by,
  //     gs.session
  //   FROM exam e
  //   LEFT JOIN countries c1 ON e.country = c1.id
  //   LEFT JOIN states s1 ON e.state = s1.id
  //   LEFT JOIN districts d ON e.district = d.id
  //   LEFT JOIN cities c2 ON e.city = c2.id
  //   JOIN gowvell_session gs ON e.session_id = gs.id
  //   ${whereClause}
  //   ORDER BY e.exam_date DESC
  //   LIMIT ? OFFSET ?;
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) AS total
  //   FROM exam e
  //   JOIN gowvell_session gs ON e.session_id = gs.id
  //   ${whereClause};
  // `;

  //   // Step 1: Get total count for pagination
  //   db.query(countQuery, queryParams, (err, countResult) => {
  //     if (err) return callback(err);

  //     const totalRecords = countResult[0].total;
  //     const totalPages = Math.ceil(totalRecords / limit);
  //     const nextPage = page < totalPages ? page + 1 : null;
  //     const prevPage = page > 1 ? page - 1 : null;

  //     // Step 2: Get main exam records
  //     db.query(
  //       dataQuery,
  //       [...queryParams, parseInt(limit), parseInt(offset)],
  //       async (err, results) => {
  //         if (err) return callback(err);

  //         try {
  //           // Step 3: Fetch all school, class, and subject names
  //           const [schoolRows] = await db
  //             .promise()
  //             .query("SELECT id, school_name FROM school");
  //           const [classRows] = await db
  //             .promise()
  //             .query("SELECT id, name FROM class");
  //           const [subjectRows] = await db
  //             .promise()
  //             .query("SELECT id, name FROM subject_master");

  //           const schoolMap = {};
  //           schoolRows.forEach((sch) => {
  //             schoolMap[sch.id] = sch.school_name;
  //           });

  //           const classMap = {};
  //           classRows.forEach((cls) => {
  //             classMap[cls.id] = cls.name;
  //           });

  //           const subjectMap = {};
  //           subjectRows.forEach((sub) => {
  //             subjectMap[sub.id] = sub.name;
  //           });

  //           // Step 4: Resolve names in JS
  //           results.forEach((exam) => {
  //             const schoolIds = Array.isArray(exam.school_id)
  //               ? exam.school_id
  //               : JSON.parse(exam.school_id || "[]");

  //             const classIds = Array.isArray(exam.classes_id)
  //               ? exam.classes_id
  //               : JSON.parse(exam.classes_id || "[]");

  //             const subjectIds = Array.isArray(exam.subjects_id)
  //               ? exam.subjects_id
  //               : JSON.parse(exam.subjects_id || "[]");

  //             exam.school_name = schoolIds
  //               .map((id) => schoolMap[id] || `School ${id}`)
  //               .join(", ");

  //             exam.class_name = classIds
  //               .map((id) => classMap[id] || `Class ${id}`)
  //               .join(", ");

  //             exam.subject_name = subjectIds
  //               .map((id) => subjectMap[id] || `Subject ${id}`)
  //               .join(", ");
  //           });

  //           // Step 5: Final response
  //           callback(null, {
  //             exams: results,
  //             currentPage: page,
  //             nextPage,
  //             prevPage,
  //             totalPages,
  //             totalRecords,
  //           });
  //         } catch (err) {
  //           callback(err);
  //         }
  //       },
  //     );
  //   });
  // },

  async getAllwithpaginate(
    page = 1,
    limit = 10,
    search = "",
    session_id = null,
  ) {
    const offset = (page - 1) * limit;

    let whereClause = "";
    let queryParams = [];

    // Session filter
    if (session_id) {
      whereClause = "WHERE e.session_id = ?";
      queryParams.push(session_id);
    } else {
      whereClause = "WHERE gs.status = 'active'";
    }

    // Search filter
    if (search && search.trim()) {
      whereClause += `
        AND (
          e.school_id LIKE ? OR
          e.level LIKE ? OR
          e.classes_id LIKE ? OR
          e.subjects_id LIKE ?
        )
      `;
      queryParams.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      );
    }

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM exam e
      JOIN gowvell_session gs ON e.session_id = gs.id
      ${whereClause}
    `;

    const dataQuery = `
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
        e.updated_by,
        gs.session
      FROM exam e
      LEFT JOIN countries c1 ON e.country = c1.id
      LEFT JOIN states s1 ON e.state = s1.id
      LEFT JOIN districts d ON e.district = d.id
      LEFT JOIN cities c2 ON e.city = c2.id
      JOIN gowvell_session gs ON e.session_id = gs.id
      ${whereClause}
      ORDER BY e.exam_date DESC
      LIMIT ? OFFSET ?
    `;

    const [[{ total }]] = await db.promise().query(countQuery, queryParams);

    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const [results] = await db
      .promise()
      .query(dataQuery, [...queryParams, limit, offset]);

    // 🔥 Fetch master data ONCE
    const [[schools], [classes], [subjects]] = await Promise.all([
      db.promise().query("SELECT id, school_name FROM school"),
      db.promise().query("SELECT id, name FROM class"),
      db.promise().query("SELECT id, name FROM subject_master"),
    ]);

    const schoolMap = Object.fromEntries(
      schools.map((s) => [s.id, s.school_name]),
    );
    const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));
    const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]));

    // Resolve names
    results.forEach((exam) => {
      const schoolIds = safeParseIds(exam.school_id);
      const classIds = safeParseIds(exam.classes_id);
      const subjectIds = safeParseIds(exam.subjects_id);

      exam.school_name = schoolIds
        .map((id) => schoolMap[id] || `School ${id}`)
        .join(", ");

      exam.class_name = classIds
        .map((id) => classMap[id] || `Class ${id}`)
        .join(", ");

      exam.subject_name = subjectIds
        .map((id) => subjectMap[id] || `Subject ${id}`)
        .join(", ");
    });

    return {
      exams: results,
      currentPage: page,
      nextPage,
      prevPage,
      totalPages,
      totalRecords: total,
    };
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
      callback,
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
      callback,
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
