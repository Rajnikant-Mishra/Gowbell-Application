// export default ResultModel;
import { db } from "../../config/db.js";

const ResultModel = {
  create: (data, callback) => {
    const {
      school_id,
      student_name,
      class_id,
      roll_no,
      full_mark,
      mark_secured,
      level,
      subject_id,
    } = data;

    const safeFullMark = Number(full_mark) || 0;

    // If mark_secured is null or undefined, keep it null
    const safeMarkSecured = mark_secured == null ? null : Number(mark_secured);

    // Only calculate percentage if mark_secured is NOT null and full_mark > 0
    const percentage =
      safeMarkSecured !== null && safeFullMark > 0
        ? (safeMarkSecured / safeFullMark) * 100
        : null;

    const query = `
    INSERT INTO result 
    (school_id, student_name, class_id, roll_no, full_mark, mark_secured, percentage, level, subject_id, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(
      query,
      [
        school_id,
        student_name,
        class_id,
        roll_no,
        safeFullMark,
        safeMarkSecured,
        percentage,
        level,
        subject_id,
        "pending",
      ],
      (err, result) => {
        if (err) return callback(err);
        callback(null, {
          message: "Result created successfully",
          id: result.insertId,
        });
      }
    );
  },

  // In your ResultModel
  update: (id, data, callback) => {
    const {
      school_name,
      student_name,
      class_id,
      roll_no,
      full_mark,
      mark_secured,
      level,
      subject_id,
    } = data;

    const query = `
    UPDATE result 
    SET school_name = ?, student_name = ?, class_id = ?, roll_no = ?, full_mark = ?, mark_secured = ?, level = ?, subject_id = ?
    WHERE id = ?
  `;

    db.query(
      query,
      [
        school_name,
        student_name,
        class_id,
        roll_no,
        full_mark,
        mark_secured,
        level,
        subject_id,
        id,
      ],
      (err, result) => {
        if (err) return callback(err);

        if (result.affectedRows === 0) {
          // No rows were updated
          return callback(new Error("No result found with the provided ID."));
        }

        callback(null, {
          message: "Result updated successfully",
        });
      }
    );
  },

  // Get Result by ID
  getById: (id, callback) => {
    const query = `SELECT * FROM result WHERE id = ?`;

    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error("Result not found"));
      callback(null, results[0]);
    });
  },

  // Bulk Upload Results
  bulkUpload: (students) => {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(students) || students.length === 0) {
        return reject(new Error("No student data provided"));
      }

      const schoolMap = new Map();
      const classMap = new Map();
      const subjectMap = new Map();

      const processStudents = async (students) => {
        const promises = students.map(async (student) => {
          // Validate student data
          if (
            !student.student_name ||
            !student.school_name ||
            !student.class_name ||
            !student.subject
          ) {
            throw new Error(
              `Missing required fields for student: ${JSON.stringify(student)}`
            );
          }

          // Validate numeric fields
          if (
            (student.mark_secured != null &&
              isNaN(Number(student.mark_secured))) ||
            (student.full_mark != null && isNaN(Number(student.full_mark)))
          ) {
            throw new Error(
              `Invalid numeric values for student: ${student.student_name}`
            );
          }

          // Validate mark_secured against full_mark
          if (
            student.mark_secured != null &&
            student.full_mark != null &&
            Number(student.mark_secured) > Number(student.full_mark)
          ) {
            throw new Error(
              `Mark secured cannot exceed full mark for student: ${student.student_name}`
            );
          }

          // Validate string formats
          const nameRegex = /^[A-Za-z0-9\s-]+$/;
          if (!nameRegex.test(student.student_name)) {
            throw new Error(
              `Invalid student_name format for: ${student.student_name}. Must contain only letters, numbers, spaces, or hyphens.`
            );
          }

          // if (!nameRegex.test(student.school_name)) {
          //   throw new Error(
          //     `Invalid school_name format for student: ${student.student_name}. Must contain only letters, numbers, spaces, or hyphens.`
          //   );
          // }

          if (!nameRegex.test(student.class_name)) {
            throw new Error(
              `Invalid class_name format for student: ${student.student_name}. Must contain only letters, numbers, spaces, or hyphens.`
            );
          }

          if (!nameRegex.test(student.subject)) {
            throw new Error(
              `Invalid subject format for student: ${student.student_name}. Must contain only letters, numbers, spaces, or hyphens.`
            );
          }

          // Validate roll_no if provided
          if (
            student.roll_no != null &&
            !/^[A-Za-z0-9-]+$/.test(student.roll_no)
          ) {
            throw new Error(
              `Invalid roll_no format for student: ${student.student_name}.`
            );
          }

          // Process School
          const processSchool = () =>
            new Promise((resolveSchool, rejectSchool) => {
              if (schoolMap.has(student.school_name)) {
                student.school_id = schoolMap.get(student.school_name);
                resolveSchool();
              } else {
                const schoolQuery = `SELECT id FROM school WHERE school_name = ?`;
                db.query(schoolQuery, [student.school_name], (err, results) => {
                  if (err) return rejectSchool(err);
                  if (results.length > 0) {
                    const schoolId = results[0].id;
                    schoolMap.set(student.school_name, schoolId);
                    student.school_id = schoolId;
                    resolveSchool();
                  } else {
                    rejectSchool(
                      new Error(
                        `School '${student.school_name}' for student '${student.student_name}' does not exist in the school table.`
                      )
                    );
                  }
                });
              }
            });

          // Process Class
          const processClass = () =>
            new Promise((resolveClass, rejectClass) => {
              if (classMap.has(student.class_name)) {
                student.class_id = classMap.get(student.class_name);
                resolveClass();
              } else {
                const classQuery = `SELECT id FROM class WHERE name = ?`;
                db.query(classQuery, [student.class_name], (err, results) => {
                  if (err) return rejectClass(err);
                  if (results.length > 0) {
                    const classId = results[0].id;
                    classMap.set(student.class_name, classId);
                    student.class_id = classId;
                    resolveClass();
                  } else {
                    rejectClass(
                      new Error(
                        `Class '${student.class_name}' for student '${student.student_name}' does not exist in the class table.`
                      )
                    );
                  }
                });
              }
            });

          // Process Subject
          const processSubject = () =>
            new Promise((resolveSubject, rejectSubject) => {
              if (subjectMap.has(student.subject)) {
                student.subject_id = subjectMap.get(student.subject);
                resolveSubject();
              } else {
                const subjectQuery = `SELECT id FROM subject_master WHERE name = ?`;
                db.query(subjectQuery, [student.subject], (err, results) => {
                  if (err) return rejectSubject(err);
                  if (results.length > 0) {
                    const subjectId = results[0].id;
                    subjectMap.set(student.subject, subjectId);
                    student.subject_id = subjectId;
                    resolveSubject();
                  } else {
                    rejectSubject(
                      new Error(
                        `Subject '${student.subject}' for student '${student.student_name}' does not exist in the subject_master table.`
                      )
                    );
                  }
                });
              }
            });

          await Promise.all([
            processSchool(),
            processClass(),
            processSubject(),
          ]);
          return student;
        });

        return Promise.all(promises);
      };

      db.beginTransaction(async (err) => {
        if (err) return reject(err);

        try {
          const processedStudents = await processStudents(students);

          const values = processedStudents.map((student) => {
            const percentage =
              student.full_mark && student.mark_secured != null
                ? (Number(student.mark_secured) / Number(student.full_mark)) *
                  100
                : null;
            return [
              student.school_id,
              student.student_name,
              student.class_id,
              student.roll_no,
              student.full_mark == null ? null : Number(student.full_mark),
              student.mark_secured == null
                ? null
                : Number(student.mark_secured),
              percentage,
              student.level,
              student.subject_id,
              null, // ranking
              null, // medals
              null, // certificate
              null, // remarks
              "pending",
            ];
          });

          const query = `
          INSERT INTO result 
          (school_id, student_name, class_id, roll_no, full_mark, mark_secured, percentage, level, subject_id, ranking, medals, certificate, remarks, status) 
          VALUES ? 
          ON DUPLICATE KEY UPDATE 
            school_id = VALUES(school_id),
            student_name = VALUES(student_name),
            class_id = VALUES(class_id),
            roll_no = VALUES(roll_no),
            full_mark = VALUES(full_mark),
            mark_secured = VALUES(mark_secured),
            percentage = VALUES(percentage),
            level = VALUES(level),
            subject_id = VALUES(subject_id),
            updated_at = CURRENT_TIMESTAMP
        `;

          db.query(query, [values], (err, result) => {
            if (err) {
              return db.rollback(() => reject(err));
            }
            db.commit((err) => {
              if (err) return reject(err);
              resolve({
                message: `${result.affectedRows} records inserted successfully`,
              });
            });
          });
        } catch (err) {
          db.rollback(() => reject(err));
        }
      });
    });
  },

  // Fetch paginated results
  getAllResults: (page, limit, callback) => {
    const offset = (page - 1) * limit;

    // Query to count total records for pagination
    const countQuery = "SELECT COUNT(*) AS total FROM result";
    db.query(countQuery, (countErr, countResult) => {
      if (countErr) return callback(countErr, null);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      // Query to fetch paginated results
      const dataQuery = `SELECT * FROM result ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      db.query(dataQuery, [limit, offset], (err, results) => {
        if (err) return callback(err, null);

        callback(null, {
          students: results,
          totalRecords,
          totalPages,
          currentPage: page,
        });
      });
    });
  },

  // Delete by ID
  deleteById: (id, callback) => {
    const query = "DELETE FROM result WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return callback(err);
      if (result.affectedRows === 0) {
        return callback(null, {
          message: "No record found with the provided ID",
        });
      }
      callback(null, { message: "Record deleted successfully" });
    });
  },

  //get all result by select school class subject
  // getStudents: (schoolId, classIds, subjectId, callback) => {
  //   if (!Array.isArray(classIds)) {
  //     classIds = [classIds];
  //   }
  //   const classPlaceholders = classIds.map(() => "?").join(",");

  //   const dataQuery = `
  //   SELECT
  //     r.id,
  //     r.roll_no,
  //     r.student_name,
  //     r.school_id,
  //     r.roll_no,
  //     r.full_mark,
  //     r.mark_secured,
  //     r.percentage,
  //     r.medals,
  //     r.certificate,
  //     r.remarks,
  //     r.ranking,
  //     r.level,
  //     r.status,
  //     c.name AS class_name,
  //     sub.name AS subject_name
  //   FROM result r
  //   LEFT JOIN class c ON r.class_id = c.id
  //   LEFT JOIN subject_master sub ON r.subject_id = sub.id
  //   WHERE r.school_id = ?
  //     AND r.class_id IN (${classPlaceholders})
  //     AND r.subject_id = ?
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) as total_count
  //   FROM result r
  //   WHERE r.school_id = ?
  //     AND r.class_id IN (${classPlaceholders})
  //     AND r.subject_id = ?
  // `;

  //   const dataParams = [schoolId, ...classIds, subjectId];
  //   const countParams = [schoolId, ...classIds, subjectId];

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);

  //       const totalCount = countResult[0].total_count;
  //       callback(null, { students, totalCount });
  //     });
  //   });
  // },

  getStudents: (schoolId, classIds, subjectIds, callback) => {
    if (!Array.isArray(classIds)) {
      classIds = [classIds];
    }
    if (!Array.isArray(subjectIds)) {
      subjectIds = [subjectIds];
    }

    const classPlaceholders = classIds.map(() => "?").join(",");
    const subjectPlaceholders = subjectIds.map(() => "?").join(",");

    const dataQuery = `
    SELECT
      r.id,
      r.roll_no,
      r.student_name,
      r.school_id,
      r.roll_no,
      r.full_mark,
      r.mark_secured,
      r.percentage,
      r.medals,
      r.certificate,
      r.remarks,
      r.ranking,
      r.level,
      r.status,
      c.name AS class_name,
      sub.name AS subject_name
    FROM result r
    LEFT JOIN class c ON r.class_id = c.id
    LEFT JOIN subject_master sub ON r.subject_id = sub.id
    WHERE r.school_id = ?
      AND r.class_id IN (${classPlaceholders})
      AND r.subject_id IN (${subjectPlaceholders})
  `;

    const countQuery = `
    SELECT COUNT(*) as total_count
    FROM result r
    WHERE r.school_id = ?
      AND r.class_id IN (${classPlaceholders})
      AND r.subject_id IN (${subjectPlaceholders})
  `;

    const dataParams = [schoolId, ...classIds, ...subjectIds];
    const countParams = [schoolId, ...classIds, ...subjectIds];

    db.query(dataQuery, dataParams, (err, students) => {
      if (err) return callback(err);

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) return callback(countErr);

        const totalCount = countResult[0].total_count;
        callback(null, { students, totalCount });
      });
    });
  },

  // Fetch class names
  getClassNames: (classIds, callback) => {
    if (!Array.isArray(classIds) || !classIds.length) return callback(null, []);
    const placeholders = classIds.map(() => "?").join(",");
    const query = `SELECT id, name AS class_name FROM class WHERE id IN (${placeholders})`;
    db.query(query, classIds, callback);
  },

  // Fetch subject names
  getSubjectNames: (subjectIds, callback) => {
    if (!Array.isArray(subjectIds) || !subjectIds.length)
      return callback(null, []);
    const placeholders = subjectIds.map(() => "?").join(",");
    const query = `SELECT id, name AS subject_name FROM subject_master WHERE id IN (${placeholders})`;
    db.query(query, subjectIds, callback);
  },

  // Update pending percentages
  // updatePendingPercentages: (schoolId, classIds, subjectId, callback) => {
  //   if (
  //     !schoolId ||
  //     !Array.isArray(classIds) ||
  //     classIds.length === 0 ||
  //     !subjectId
  //   ) {
  //     return callback(
  //       new Error(
  //         "Invalid input: schoolId, classIds (array), and subjectId are required"
  //       )
  //     );
  //   }

  //   const classPlaceholders = classIds.map(() => "?").join(",");

  //   const validateQuery = `
  //   SELECT COUNT(*) AS invalid_count
  //   FROM result
  //   WHERE status = 'pending'
  //     AND school_id = ?
  //     AND class_id IN (${classPlaceholders})
  //     AND subject_id = ?
  //     AND (full_mark <= 0 OR mark_secured < 0 OR mark_secured > full_mark)
  // `;
  //   const validateParams = [schoolId, ...classIds, subjectId];

  //   db.query(validateQuery, validateParams, (err, result) => {
  //     if (err) return callback(err);
  //     if (result[0].invalid_count > 0) {
  //       return callback(
  //         new Error("Invalid data: Check full_mark and mark_secured values")
  //       );
  //     }

  //     const updateQuery = `
  //     WITH RankedResults AS (
  //       SELECT
  //         id,
  //         DENSE_RANK() OVER (PARTITION BY class_id, subject_id ORDER BY (mark_secured / full_mark) * 100 DESC) AS student_rank,
  //         COUNT(*) OVER (PARTITION BY class_id, subject_id) AS total_students
  //       FROM result
  //       WHERE status = 'pending'
  //         AND school_id = ?
  //         AND class_id IN (${classPlaceholders})
  //         AND subject_id = ?
  //         AND full_mark > 0
  //     )
  //     UPDATE result r
  //     JOIN RankedResults rr ON r.id = rr.id
  //     SET
  //       r.percentage = (r.mark_secured / r.full_mark) * 100,
  //       r.status = 'success',
  //       r.certificate = CASE
  //                         WHEN (r.mark_secured / r.full_mark) * 100 >= 90 THEN 'Excellence'
  //                         WHEN (r.mark_secured / r.full_mark) * 100 >= 80 THEN 'Merit'
  //                         ELSE NULL
  //                       END,
  //       r.remarks = CASE
  //                         WHEN (r.mark_secured / r.full_mark) * 100 >= 90 THEN 'Outstanding Performance'
  //                         WHEN (r.mark_secured / r.full_mark) * 100 >= 80 THEN 'Good Performance'
  //                         ELSE NULL
  //                       END,
  //       r.ranking = rr.student_rank,
  //       r.medals = CASE
  //                         WHEN (r.mark_secured / r.full_mark) * 100 < 60 THEN NULL
  //                         WHEN rr.student_rank = 1 THEN 'Gold'
  //                         WHEN rr.student_rank = 2 THEN 'Silver'
  //                         WHEN rr.student_rank = 3 THEN 'Bronze'
  //                         ELSE NULL
  //                       END,
  //       r.updated_at = CURRENT_TIMESTAMP
  //     WHERE r.status = 'pending'
  //       AND r.school_id = ?
  //       AND r.class_id IN (${classPlaceholders})
  //       AND r.subject_id = ?
  //       AND r.full_mark > 0
  //   `;

  //     const updateParams = [
  //       schoolId,
  //       ...classIds,
  //       subjectId,
  //       schoolId,
  //       ...classIds,
  //       subjectId,
  //     ];

  //     db.query(updateQuery, updateParams, (err, result) => {
  //       if (err) return callback(err);
  //       const message =
  //         result.affectedRows > 0
  //           ? `${
  //               result.affectedRows
  //             } pending records updated for school: ${schoolId}, classes: ${classIds.join(
  //               ", "
  //             )}, subject: ${subjectId}`
  //           : `No pending records found for school: ${schoolId}, classes: ${classIds.join(
  //               ", "
  //             )}, subject: ${subjectId}`;
  //       callback(null, { message, affectedRows: result.affectedRows });
  //     });
  //   });
  // },
  updatePendingPercentages: (schoolId, classIds, subjectIds, callback) => {
    if (
      !schoolId ||
      !Array.isArray(classIds) ||
      classIds.length === 0 ||
      !Array.isArray(subjectIds) ||
      subjectIds.length === 0
    ) {
      return callback(
        new Error(
          "Invalid input: schoolId, classIds (array), and subjectIds (array) are required"
        )
      );
    }

    const classPlaceholders = classIds.map(() => "?").join(",");
    const subjectPlaceholders = subjectIds.map(() => "?").join(",");

    const validateQuery = `
    SELECT COUNT(*) AS invalid_count
    FROM result
    WHERE status = 'pending'
      AND school_id = ?
      AND class_id IN (${classPlaceholders})
      AND subject_id IN (${subjectPlaceholders})
      AND (full_mark <= 0 OR mark_secured < 0 OR mark_secured > full_mark)
  `;
    const validateParams = [schoolId, ...classIds, ...subjectIds];

    db.query(validateQuery, validateParams, (err, result) => {
      if (err) return callback(err);
      if (result[0].invalid_count > 0) {
        return callback(
          new Error("Invalid data: Check full_mark and mark_secured values")
        );
      }

      const updateQuery = `
      WITH RankedResults AS (
        SELECT 
          id,
          DENSE_RANK() OVER (
            PARTITION BY class_id, subject_id 
            ORDER BY (mark_secured / full_mark) * 100 DESC
          ) AS student_rank,
          COUNT(*) OVER (PARTITION BY class_id, subject_id) AS total_students
        FROM result
        WHERE status = 'pending'
          AND school_id = ?
          AND class_id IN (${classPlaceholders})
          AND subject_id IN (${subjectPlaceholders})
          AND full_mark > 0
      )
      UPDATE result r
      JOIN RankedResults rr ON r.id = rr.id
      SET 
        r.percentage = (r.mark_secured / r.full_mark) * 100,
        r.status = 'success',
        r.certificate = CASE 
                          WHEN (r.mark_secured / r.full_mark) * 100 >= 90 THEN 'achievement'
                          WHEN (r.mark_secured / r.full_mark) * 100 >= 80 THEN 'achievement'
                          ELSE NULL
                        END,
        r.remarks = CASE 
                          WHEN (r.mark_secured / r.full_mark) * 100 >= 90 THEN 'Outstanding Performance'
                          WHEN (r.mark_secured / r.full_mark) * 100 >= 80 THEN 'Good Performance'
                          ELSE NULL
                        END,
        r.ranking = rr.student_rank,
        r.medals = CASE 
                          WHEN (r.mark_secured / r.full_mark) * 100 < 60 THEN NULL
                          WHEN rr.student_rank = 1 THEN 'Gold'
                          WHEN rr.student_rank = 2 THEN 'Silver'
                          WHEN rr.student_rank = 3 THEN 'Bronze'
                          ELSE NULL
                        END,
        r.updated_at = CURRENT_TIMESTAMP
      WHERE r.status = 'pending'
        AND r.school_id = ?
        AND r.class_id IN (${classPlaceholders})
        AND r.subject_id IN (${subjectPlaceholders})
        AND r.full_mark > 0
    `;

      const updateParams = [
        schoolId,
        ...classIds,
        ...subjectIds,
        schoolId,
        ...classIds,
        ...subjectIds,
      ];

      db.query(updateQuery, updateParams, (err, result) => {
        if (err) return callback(err);
        const message =
          result.affectedRows > 0
            ? `${
                result.affectedRows
              } pending records updated for school: ${schoolId}, classes: ${classIds.join(
                ", "
              )}, subjects: ${subjectIds.join(", ")}`
            : `No pending records found for school: ${schoolId}, classes: ${classIds.join(
                ", "
              )}, subjects: ${subjectIds.join(", ")}`;
        callback(null, { message, affectedRows: result.affectedRows });
      });
    });
  },

  //updated medals
  updateMedal: (id, certificate , callback) => {
    const query = `
      UPDATE result
      SET certificate  = ?
      WHERE id = ?
    `;
    db.query(query, [certificate , id], (err, result) => {
      if (err) return callback(err);
      callback(null, { message: "Wild card entry successfully" });
    });
  },
};

export default ResultModel;
