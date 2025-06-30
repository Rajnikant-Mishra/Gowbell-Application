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
  // bulkUpload: (students, callback) => {
  //   if (!Array.isArray(students) || students.length === 0) {
  //     return callback("No student data provided");
  //   }

  //   // Process each student to fetch or insert the subject_id and class_id
  //   const processStudents = (students, cb) => {
  //     const classMap = new Map(); // Cache class_name -> id mapping
  //     const subjectMap = new Map(); // Cache subject_name -> id mapping
  //     const promises = students.map((student) => {
  //       return new Promise((resolve, reject) => {
  //         // Process class_name
  //         const processClass = () =>
  //           new Promise((resolveClass, rejectClass) => {
  //             if (classMap.has(student.class_name)) {
  //               student.class_id = classMap.get(student.class_name);
  //               resolveClass();
  //             } else {
  //               const classQuery = `SELECT id FROM class WHERE name = ?`;
  //               db.query(classQuery, [student.class_name], (err, results) => {
  //                 if (err) return rejectClass(err);
  //                 if (results.length > 0) {
  //                   const classId = results[0].id;
  //                   classMap.set(student.class_name, classId);
  //                   student.class_id = classId;
  //                   resolveClass();
  //                 } else {
  //                   const insertClassQuery = `INSERT INTO class (name, status, created_by) VALUES (?, ?, ?)`;
  //                   db.query(
  //                     insertClassQuery,
  //                     [student.class_name, "active", "system"],
  //                     (insertErr, insertResult) => {
  //                       if (insertErr) return rejectClass(insertErr);
  //                       const classId = insertResult.insertId;
  //                       classMap.set(student.class_name, classId);
  //                       student.class_id = classId;
  //                       resolveClass();
  //                     }
  //                   );
  //                 }
  //               });
  //             }
  //           });

  //         // Process subject_name
  //         const processSubject = () =>
  //           new Promise((resolveSubject, rejectSubject) => {
  //             if (subjectMap.has(student.subject)) {
  //               student.subject_id = subjectMap.get(student.subject);
  //               resolveSubject();
  //             } else {
  //               const subjectQuery = `SELECT id FROM subject_master WHERE name = ?`;
  //               db.query(subjectQuery, [student.subject], (err, results) => {
  //                 if (err) return rejectSubject(err);
  //                 if (results.length > 0) {
  //                   const subjectId = results[0].id;
  //                   subjectMap.set(student.subject, subjectId);
  //                   student.subject_id = subjectId;
  //                   resolveSubject();
  //                 } else {
  //                   const insertSubjectQuery = `INSERT INTO subject_master (name, status, created_by) VALUES (?, ?, ?)`;
  //                   db.query(
  //                     insertSubjectQuery,
  //                     [student.subject, "active", "system"],
  //                     (insertErr, insertResult) => {
  //                       if (insertErr) return rejectSubject(insertErr);
  //                       const subjectId = insertResult.insertId;
  //                       subjectMap.set(student.subject, subjectId);
  //                       student.subject_id = subjectId;
  //                       resolveSubject();
  //                     }
  //                   );
  //                 }
  //               });
  //             }
  //           });

  //         // Process both class and subject
  //         Promise.all([processClass(), processSubject()])
  //           .then(resolve)
  //           .catch(reject);
  //       });
  //     });

  //     // Wait for all promises to resolve
  //     Promise.all(promises)
  //       .then(() => cb(null, students))
  //       .catch(cb);
  //   };

  //   processStudents(students, (err, processedStudents) => {
  //     if (err) return callback(err);

  //     const values = processedStudents.map((student) => [
  //       student.school_name,
  //       student.student_name,
  //       student.class_id, // Use class_id instead of class_name
  //       student.roll_no,
  //       student.full_mark,
  //       // student.mark_secured,
  //       student.mark_secured == null ? null : Number(student.mark_secured),
  //       null, // percentage
  //       student.level,
  //       student.subject_id, // Use subject_id instead of subject_name
  //       null, // rank
  //       null, // medals
  //       null, // certificate
  //       null, // remarks
  //       "pending", // default status
  //     ]);

  //     const query = `
  //       INSERT INTO result
  //       (school_name, student_name, class_id, roll_no, full_mark, mark_secured, percentage, level, subject_id, ranking, medals, certificate, remarks, status)
  //       VALUES ?
  //       ON DUPLICATE KEY UPDATE
  //         full_mark = VALUES(full_mark),
  //         mark_secured = VALUES(mark_secured),
  //         percentage = VALUES(percentage),
  //         level = VALUES(level),
  //         subject_id = VALUES(subject_id),
  //         updated_at = CURRENT_TIMESTAMP
  //     `;

  //     db.query(query, [values], (err, result) => {
  //       if (err) return callback(err);
  //       callback(null, {
  //         message: `${result.affectedRows} records inserted/updated successfully`,
  //       });
  //     });
  //   });
  // },
  bulkUpload: (students) => {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(students) || students.length === 0) {
        return reject(new Error("No student data provided"));
      }

      const classMap = new Map();
      const subjectMap = new Map();

      const processStudents = async (students) => {
        const promises = students.map(async (student) => {
          // Validate student data
          if (
            !student.student_name ||
            !student.class_name ||
            !student.subject
          ) {
            throw new Error(
              `Missing required fields for student: ${JSON.stringify(student)}`
            );
          }
          if (
            student.mark_secured != null &&
            isNaN(Number(student.mark_secured))
          ) {
            throw new Error(
              `Invalid mark_secured for student: ${student.student_name}`
            );
          }

          // Validate class_name format (allows letters, numbers, spaces, and hyphens)
          const classNameRegex = /^[A-Za-z0-9\s-]+$/;
          if (!classNameRegex.test(student.class_name)) {
            throw new Error(
              `Invalid class_name format for student: ${student.student_name}. Class name must contain only letters, numbers, spaces, or hyphens.`
            );
          }

          // Validate subject format (allows letters, numbers, spaces, and hyphens)
          const subjectRegex = /^[A-Za-z0-9\s-]+$/;
          if (!subjectRegex.test(student.subject)) {
            throw new Error(
              `Invalid subject format for student: ${student.student_name}. Subject must contain only letters, numbers, spaces, or hyphens.`
            );
          }

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
                        `Class name '${student.class_name}' for student '${student.student_name}' does not exist in the class table.`
                      )
                    );
                  }
                });
              }
            });

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

          await Promise.all([processClass(), processSubject()]);
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
                ? (Number(student.mark_secured) / student.full_mark) * 100
                : null;
            return [
              student.school_name,
              student.student_name,
              student.class_id,
              student.roll_no,
              student.full_mark,
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
            (school_name, student_name, class_id, roll_no, full_mark, mark_secured, percentage, level, subject_id, ranking, medals, certificate, remarks, status) 
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
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
                message: `${result.affectedRows} records inserted/updated successfully`,
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
  // getStudents: (schoolName, classId, subjectId, callback) => {
  //   const dataQuery = `
  //   SELECT
  //     r.id,
  //     r.roll_no,
  //     r.student_name,
  //     r.school_name,
  //     r.roll_no,
  //     r.full_mark,
  //     r.mark_secured,
  //     r.percentage,
  //     r.medals,
  //     r.certificate,
  //     r.remarks,
  //     r.ranking,
  //     r.status,
  //     c.name AS class_name,
  //     sub.name AS subject_name
  //   FROM result r
  //   LEFT JOIN class c ON r.class_id = c.id
  //   LEFT JOIN subject_master sub ON r.subject_id = sub.id
  //   WHERE r.school_name = ?
  //     AND r.class_id = ?
  //     AND r.subject_id = ?
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) as total_count
  //   FROM result r
  //   WHERE r.school_name = ?
  //     AND r.class_id = ?
  //     AND r.subject_id = ?
  // `;

  //   const dataParams = [schoolName, classId, subjectId];
  //   const countParams = [schoolName, classId, subjectId];

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);

  //       const totalCount = countResult[0].total_count;
  //       callback(null, { students, totalCount });
  //     });
  //   });
  // },

  // getClassNames: (classIds, callback) => {
  //   if (!classIds.length) return callback(null, []);
  //   const placeholders = classIds.map(() => "?").join(",");
  //   const query = `SELECT id, name AS class_id FROM class WHERE id IN (${placeholders})`;
  //   db.query(query, classIds, callback);
  // },

  // getSubjectNames: (subjectIds, callback) => {
  //   if (!subjectIds.length) return callback(null, []);
  //   const placeholders = subjectIds.map(() => "?").join(",");
  //   const query = `SELECT id, name AS subject_name FROM subject_master WHERE id IN (${placeholders})`;
  //   db.query(query, subjectIds, callback);
  // },

  //--------------------------------------------------------------------------==============================

  // getStudents: (schoolName, classIds, subjectId, callback) => {
  //   // Ensure classIds is an array
  //   if (!Array.isArray(classIds)) {
  //     classIds = [classIds];
  //   }

  //   // Create placeholders for classIds
  //   const classPlaceholders = classIds.map(() => "?").join(",");

  //   const dataQuery = `
  //   SELECT
  //     r.id,
  //     r.roll_no,
  //     r.student_name,
  //     r.school_name,
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
  //   WHERE r.school_name = ?
  //     AND r.class_id IN (${classPlaceholders})
  //     AND r.subject_id = ?
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) as total_count
  //   FROM result r
  //   WHERE r.school_name = ?
  //     AND r.class_id IN (${classPlaceholders})
  //     AND r.subject_id = ?
  // `;

  //   // Combine parameters for both queries
  //   const dataParams = [schoolName, ...classIds, subjectId];
  //   const countParams = [schoolName, ...classIds, subjectId];

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);

  //       const totalCount = countResult[0].total_count;
  //       callback(null, { students, totalCount });
  //     });
  //   });
  // },

  // getClassNames: (classIds, callback) => {
  //   if (!Array.isArray(classIds) || !classIds.length) return callback(null, []);
  //   const placeholders = classIds.map(() => "?").join(",");
  //   const query = `SELECT id, name AS class_name FROM class WHERE id IN (${placeholders})`;
  //   db.query(query, classIds, callback);
  // },

  // getSubjectNames: (subjectIds, callback) => {
  //   if (!Array.isArray(subjectIds) || !subjectIds.length)
  //     return callback(null, []);
  //   const placeholders = subjectIds.map(() => "?").join(",");
  //   const query = `SELECT id, name AS subject_name FROM subject_master WHERE id IN (${placeholders})`;
  //   db.query(query, subjectIds, callback);
  // },

  // // Calculate and update percentages for rows with status "pending"
  // // updatePendingPercentages: (callback) => {
  // //   const query = `
  // //     WITH RankedResults AS (
  // //       SELECT
  // //         id,
  // //         ROW_NUMBER() OVER (PARTITION BY class_id, subject_id ORDER BY mark_secured DESC) AS student_rank
  // //       FROM result
  // //       WHERE status = 'pending' AND full_mark > 0
  // //     )
  // //     UPDATE result r
  // //     JOIN RankedResults rr ON r.id = rr.id
  // //     SET
  // //       r.percentage = (r.mark_secured / r.full_mark) * 100,
  // //       r.status = 'success',
  // //       r.certificate = CASE
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 90 AND (r.mark_secured / r.full_mark) * 100 <= 100 THEN 'Excellence'
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 80 AND (r.mark_secured / r.full_mark) * 100 < 90 THEN 'Merit'
  // //                   ELSE NULL
  // //                 END,
  // //                 r.remarks = CASE
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 90 AND (r.mark_secured / r.full_mark) * 100 <= 100 THEN 'Outstanding Performance'
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 80 AND (r.mark_secured / r.full_mark) * 100 < 90 THEN 'Good Performance'
  // //                   ELSE NULL
  // //                 END,
  // //                  r.ranking = CASE
  // //                    WHEN rr.student_rank = 1 THEN '1'
  // //                    WHEN rr.student_rank = 2 THEN '2'
  // //                    WHEN rr.student_rank = 3 THEN '3'
  // //                    ELSE NULL
  // //                  END,
  // //       r.medals = CASE
  // //                    WHEN rr.student_rank = 1 THEN 'Gold'
  // //                    WHEN rr.student_rank = 2 THEN 'Silver'
  // //                    WHEN rr.student_rank = 3 THEN 'Bronze'
  // //                    ELSE NULL
  // //                  END,
  // //       r.updated_at = CURRENT_TIMESTAMP
  // //     WHERE r.status = 'pending' AND r.full_mark > 0
  // //   `;

  // //   db.query(query, (err, result) => {
  // //     if (err) return callback(err);
  // //     callback(null, {
  // //       message: `${result.affectedRows} pending records updated`,
  // //     });
  // //   });
  // // },
  // // Calculate and update percentages for rows with status "pending"
  // // updatePendingPercentages: (callback) => {
  // //   const query = `
  // //     WITH RankedResults AS (
  // //       SELECT
  // //         id,
  // //         ROW_NUMBER() OVER (PARTITION BY class_id, subject_id ORDER BY mark_secured DESC) AS student_rank,
  // //         COUNT(*) OVER (PARTITION BY class_id, subject_id) AS total_students
  // //       FROM result
  // //       WHERE status = 'pending' AND full_mark > 0
  // //     )
  // //     UPDATE result r
  // //     JOIN RankedResults rr ON r.id = rr.id
  // //     SET
  // //       r.percentage = (r.mark_secured / r.full_mark) * 100,
  // //       r.status = 'success',
  // //       r.certificate = CASE
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 90 AND (r.mark_secured / r.full_mark) * 100 <= 100 THEN 'Excellence'
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 80 AND (r.mark_secured / r.full_mark) * 100 < 90 THEN 'Merit'
  // //                   ELSE NULL
  // //                 END,
  // //       r.remarks = CASE
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 90 AND (r.mark_secured / r.full_mark) * 100 <= 100 THEN 'Outstanding Performance'
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 80 AND (r.mark_secured / r.full_mark) * 100 < 90 THEN 'Good Performance'
  // //                   ELSE NULL
  // //                 END,
  // //       r.ranking = CASE
  // //                   WHEN rr.student_rank = 1 THEN '1'
  // //                   WHEN rr.student_rank = 2 THEN '2'
  // //                   WHEN rr.student_rank = 3 THEN '3'
  // //                   ELSE NULL
  // //                 END,
  // //       r.medals = CASE
  // //                   WHEN rr.student_rank = 1 AND rr.total_students > 2 THEN 'Gold'
  // //                   WHEN rr.student_rank = 2 AND rr.total_students > 2 THEN 'Silver'
  // //                   WHEN rr.student_rank = 3 AND rr.total_students > 2 THEN 'Bronze'
  // //                   WHEN rr.total_students = 2 AND (r.mark_secured / r.full_mark) * 100 >= 60 AND rr.student_rank = 1 THEN 'Gold'
  // //                   WHEN rr.total_students = 2 AND (r.mark_secured / r.full_mark) * 100 >= 60 AND rr.student_rank = 2 THEN 'Silver'
  // //                   ELSE NULL
  // //                 END,
  // //       r.updated_at = CURRENT_TIMESTAMP
  // //     WHERE r.status = 'pending' AND r.full_mark > 0
  // //   `;

  // //   db.query(query, (err, result) => {
  // //     if (err) return callback(err);
  // //     callback(null, {
  // //       message: `${result.affectedRows} pending records updated`,
  // //     });
  // //   });
  // // },

  // //28.06.25
  // // updatePendingPercentages: (callback) => {
  // //   const query = `
  // //     WITH RankedResults AS (
  // //       SELECT
  // //         id,
  // //         DENSE_RANK() OVER (PARTITION BY class_id, subject_id ORDER BY (mark_secured / full_mark) * 100 DESC) AS student_rank,
  // //         COUNT(*) OVER (PARTITION BY class_id, subject_id) AS total_students
  // //       FROM result
  // //       WHERE status = 'pending' AND full_mark > 0
  // //     )
  // //     UPDATE result r
  // //     JOIN RankedResults rr ON r.id = rr.id
  // //     SET
  // //       r.percentage = (r.mark_secured / r.full_mark) * 100,
  // //       r.status = 'success',
  // //       r.certificate = CASE
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 90 AND (r.mark_secured / r.full_mark) * 100 <= 100 THEN 'Excellence'
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 80 AND (r.mark_secured / r.full_mark) * 100 < 90 THEN 'Merit'
  // //                   ELSE NULL
  // //                 END,
  // //       r.remarks = CASE
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 90 AND (r.mark_secured / r.full_mark) * 100 <= 100 THEN 'Outstanding Performance'
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 >= 80 AND (r.mark_secured / r.full_mark) * 100 < 90 THEN 'Good Performance'
  // //                   ELSE NULL
  // //                 END,
  // //       r.ranking = rr.student_rank,
  // //       r.medals = CASE
  // //                   WHEN (r.mark_secured / r.full_mark) * 100 < 60 THEN NULL
  // //                   WHEN rr.student_rank = 1 AND (r.mark_secured / r.full_mark) * 100 >= 60 THEN 'Gold'
  // //                   WHEN rr.student_rank = 2 AND (r.mark_secured / r.full_mark) * 100 >= 60 THEN 'Silver'
  // //                   WHEN rr.student_rank = 3 AND (r.mark_secured / r.full_mark) * 100 >= 60 THEN 'Bronze'
  // //                   ELSE NULL
  // //                 END,
  // //       r.updated_at = CURRENT_TIMESTAMP
  // //     WHERE r.status = 'pending' AND r.full_mark > 0
  // //   `;

  // //   db.query(query, (err, result) => {
  // //     if (err) return callback(err);
  // //     callback(null, {
  // //       message: `${result.affectedRows} pending records updated`,
  // //     });
  // //   });
  // // },
  // updatePendingPercentages: (schoolName, classIds, subjectId, callback) => {
  //   // Validate inputs
  //   if (!schoolName || !classIds || !Array.isArray(classIds) || classIds.length === 0 || !subjectId) {
  //     return callback(new Error("Invalid input: schoolName, classIds (array), and subjectId are required"));
  //   }

  //   // Ensure classIds is an array
  //   if (!Array.isArray(classIds)) {
  //     classIds = [classIds];
  //   }

  //   // Create placeholders for classIds
  //   const classPlaceholders = classIds.map(() => "?").join(",");

  //   // Validate data integrity
  //   const validateQuery = `
  //     SELECT COUNT(*) AS invalid_count
  //     FROM result
  //     WHERE status = 'pending'
  //       AND school_name = ?
  //       AND class_id IN (${classPlaceholders})
  //       AND subject_id = ?
  //       AND (full_mark <= 0 OR mark_secured < 0 OR mark_secured > full_mark)
  //   `;
  //   const validateParams = [schoolName, ...classIds, subjectId];

  //   db.query(validateQuery, validateParams, (err, result) => {
  //     if (err) return callback(err);
  //     if (result[0].invalid_count > 0) {
  //       return callback(new Error("Invalid data: Check full_mark and mark_secured values"));
  //     }

  //     // Main update query
  //     const updateQuery = `
  //       WITH RankedResults AS (
  //         SELECT
  //           id,
  //           DENSE_RANK() OVER (PARTITION BY class_id, subject_id ORDER BY (mark_secured / full_mark) * 100 DESC) AS student_rank,
  //           COUNT(*) OVER (PARTITION BY class_id, subject_id) AS total_students
  //         FROM result
  //         WHERE status = 'pending'
  //           AND school_name = ?
  //           AND class_id IN (${classPlaceholders})
  //           AND subject_id = ?
  //           AND full_mark > 0
  //       )
  //       UPDATE result r
  //       JOIN RankedResults rr ON r.id = rr.id
  //       SET
  //         r.percentage = (r.mark_secured / r.full_mark) * 100,
  //         r.status = 'success',
  //         r.certificate = CASE
  //                           WHEN (r.mark_secured / r.full_mark) * 100 >= 90 THEN 'Excellence'
  //                           WHEN (r.mark_secured / r.full_mark) * 100 >= 80 THEN 'Merit'
  //                           ELSE NULL
  //                         END,
  //         r.remarks = CASE
  //                           WHEN (r.mark_secured / r.full_mark) * 100 >= 90 THEN 'Outstanding Performance'
  //                           WHEN (r.mark_secured / r.full_mark) * 100 >= 80 THEN 'Good Performance'
  //                           ELSE NULL
  //                         END,
  //         r.ranking = rr.student_rank,
  //         r.medals = CASE
  //                           WHEN (r.mark_secured / r.full_mark) * 100 < 60 THEN NULL
  //                           WHEN rr.student_rank = 1 THEN 'Gold'
  //                           WHEN rr.student_rank = 2 THEN 'Silver'
  //                           WHEN rr.student_rank = 3 THEN 'Bronze'
  //                           ELSE NULL
  //                         END,
  //         r.updated_at = CURRENT_TIMESTAMP
  //       WHERE r.status = 'pending'
  //         AND r.school_name = ?
  //         AND r.class_id IN (${classPlaceholders})
  //         AND r.subject_id = ?
  //         AND r.full_mark > 0
  //     `;
  //     const updateParams = [schoolName, ...classIds, subjectId, schoolName, ...classIds, subjectId];

  //     db.query(updateQuery, updateParams, (err, result) => {
  //       if (err) return callback(err);
  //       const message = result.affectedRows > 0
  //         ? `${result.affectedRows} pending records updated for school: ${schoolName}, classes: ${classIds.join(", ")}, subject: ${subjectId}`
  //         : `No pending records found for school: ${schoolName}, classes: ${classIds.join(", ")}, subject: ${subjectId}`;
  //       callback(null, { message, affectedRows: result.affectedRows });
  //     });
  //   });
  // },

  // Fetch student results
  getStudents: (schoolId, classIds, subjectId, callback) => {
    if (!Array.isArray(classIds)) {
      classIds = [classIds];
    }
    const classPlaceholders = classIds.map(() => "?").join(",");

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
      AND r.subject_id = ?
  `;

    const countQuery = `
    SELECT COUNT(*) as total_count
    FROM result r
    WHERE r.school_id = ?
      AND r.class_id IN (${classPlaceholders})
      AND r.subject_id = ?
  `;

    const dataParams = [schoolId, ...classIds, subjectId];
    const countParams = [schoolId, ...classIds, subjectId];

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
  updatePendingPercentages: (schoolId, classIds, subjectId, callback) => {
    if (
      !schoolId ||
      !Array.isArray(classIds) ||
      classIds.length === 0 ||
      !subjectId
    ) {
      return callback(
        new Error(
          "Invalid input: schoolId, classIds (array), and subjectId are required"
        )
      );
    }

    const classPlaceholders = classIds.map(() => "?").join(",");

    const validateQuery = `
    SELECT COUNT(*) AS invalid_count
    FROM result
    WHERE status = 'pending'
      AND school_id = ?
      AND class_id IN (${classPlaceholders})
      AND subject_id = ?
      AND (full_mark <= 0 OR mark_secured < 0 OR mark_secured > full_mark)
  `;
    const validateParams = [schoolId, ...classIds, subjectId];

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
          DENSE_RANK() OVER (PARTITION BY class_id, subject_id ORDER BY (mark_secured / full_mark) * 100 DESC) AS student_rank,
          COUNT(*) OVER (PARTITION BY class_id, subject_id) AS total_students
        FROM result
        WHERE status = 'pending'
          AND school_id = ?
          AND class_id IN (${classPlaceholders})
          AND subject_id = ?
          AND full_mark > 0
      )
      UPDATE result r
      JOIN RankedResults rr ON r.id = rr.id
      SET 
        r.percentage = (r.mark_secured / r.full_mark) * 100,
        r.status = 'success',
        r.certificate = CASE 
                          WHEN (r.mark_secured / r.full_mark) * 100 >= 90 THEN 'Excellence'
                          WHEN (r.mark_secured / r.full_mark) * 100 >= 80 THEN 'Merit'
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
        AND r.subject_id = ?
        AND r.full_mark > 0
    `;

      const updateParams = [
        schoolId,
        ...classIds,
        subjectId,
        schoolId,
        ...classIds,
        subjectId,
      ];

      db.query(updateQuery, updateParams, (err, result) => {
        if (err) return callback(err);
        const message =
          result.affectedRows > 0
            ? `${
                result.affectedRows
              } pending records updated for school: ${schoolId}, classes: ${classIds.join(
                ", "
              )}, subject: ${subjectId}`
            : `No pending records found for school: ${schoolId}, classes: ${classIds.join(
                ", "
              )}, subject: ${subjectId}`;
        callback(null, { message, affectedRows: result.affectedRows });
      });
    });
  },
};

export default ResultModel;
