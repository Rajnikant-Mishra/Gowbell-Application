import { db } from "../../config/db.js";

export const Student = {
  //===============================================
  // create: (studentData, userId, callback) => {
  //   const {
  //     school_id,
  //     student_name,
  //     class_id,
  //     student_section,
  //     mobile_number,
  //     whatsapp_number,
  //     aadhaar_number,
  //     student_subject,
  //     approved = 0,
  //     approved_by = null,
  //     country,
  //     state,
  //     district,
  //     city,
  //     level = 1,
  //     level_status = "continue",
  //     session_id,
  //   } = studentData;

  //   // Step 1: Resolve session_id (same as before)
  //   const resolveSessionId = (next) => {
  //     if (session_id) {
  //       const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
  //       db.query(verifyQuery, [session_id], (err, result) => {
  //         if (err) return callback(err);
  //         if (result.length === 0)
  //           return callback(new Error("Invalid session ID selected"));
  //         return next(session_id);
  //       });
  //     } else {
  //       const sessionQuery = `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`;
  //       db.query(sessionQuery, (err, result) => {
  //         if (err) return callback(err);
  //         if (result.length === 0)
  //           return callback(new Error("No active session found"));
  //         return next(result[0].id);
  //       });
  //     }
  //   };

  //   resolveSessionId((finalSessionId) => {
  //     // Step 2: Check if Aadhaar exists in SAME session → block insert
  //     const sameSessionCheck = `
  //     SELECT student_code FROM student
  //     WHERE aadhaar_number = ? AND session_id = ?
  //     LIMIT 1
  //   `;
  //     db.query(
  //       sameSessionCheck,
  //       [aadhaar_number, finalSessionId],
  //       (err, sameSessionResult) => {
  //         if (err) return callback(err);
  //         if (sameSessionResult.length > 0) {
  //           return callback(
  //             new Error("This Aadhaar is already registered in this session")
  //           );
  //         }

  //         // Step 3: Check if Aadhaar exists in ANY session → reuse student_code
  //         const anySessionCheck = `
  //       SELECT student_code FROM student
  //       WHERE aadhaar_number = ?
  //       ORDER BY id ASC LIMIT 1
  //     `;
  //         db.query(
  //           anySessionCheck,
  //           [aadhaar_number],
  //           (err, anySessionResult) => {
  //             if (err) return callback(err);

  //             const reuseStudentCode =
  //               anySessionResult.length > 0
  //                 ? anySessionResult[0].student_code
  //                 : null;

  //             // Step 4: Fetch school code
  //             const schoolQuery = `SELECT school_code FROM school WHERE id = ?`;
  //             db.query(schoolQuery, [school_id], (err, schoolResult) => {
  //               if (err) return callback(err);
  //               if (schoolResult.length === 0)
  //                 return callback(new Error("School not found"));

  //               const school_code = schoolResult[0].school_code;
  //               const rollPrefix = `${school_code}${class_id}${level}%`;

  //               // Step 5: Generate roll_no as before
  //               const rollQuery = `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`;
  //               db.query(rollQuery, [rollPrefix], (err, rollResult) => {
  //                 if (err) return callback(err);

  //                 let newRollNumber = 1;
  //                 if (rollResult.length > 0) {
  //                   const lastRoll = rollResult[0].roll_no || "";
  //                   const lastRollNumber = parseInt(lastRoll.slice(-2), 10);
  //                   if (!isNaN(lastRollNumber))
  //                     newRollNumber = lastRollNumber + 1;
  //                 }

  //                 const formattedRollNo = `${school_code}${class_id}${level}${String(
  //                   newRollNumber
  //                 ).padStart(2, "0")}`;
  //                 const subjectValue = student_subject
  //                   ? JSON.stringify(student_subject)
  //                   : null;

  //                 // Step 6: Generate NEW student_code only if Aadhaar not found anywhere
  //                 const generateStudentCode = (cb) => {
  //                   if (reuseStudentCode) return cb(null, reuseStudentCode);

  //                   const studentCodePrefix = `GB-${finalSessionId}-`;
  //                   const studentCodeQuery = `
  //               SELECT student_code FROM student
  //               WHERE session_id = ? AND student_code LIKE ?
  //               ORDER BY id DESC LIMIT 1
  //             `;
  //                   db.query(
  //                     studentCodeQuery,
  //                     [finalSessionId, `${studentCodePrefix}%`],
  //                     (err, result) => {
  //                       if (err) return cb(err);

  //                       let newStudentCodeNumber = 1;
  //                       if (result.length > 0) {
  //                         const lastStudentCode = result[0].student_code;
  //                         const lastNumber = parseInt(
  //                           lastStudentCode.split("-").pop(),
  //                           10
  //                         );
  //                         if (!isNaN(lastNumber))
  //                           newStudentCodeNumber = lastNumber + 1;
  //                       }

  //                       const generatedStudentCode = `${studentCodePrefix}${String(
  //                         newStudentCodeNumber
  //                       ).padStart(3, "0")}`;
  //                       cb(null, generatedStudentCode);
  //                     }
  //                   );
  //                 };

  //                 generateStudentCode((err, finalStudentCode) => {
  //                   if (err) return callback(err);

  //                   // Step 7: Insert student record
  //                   const insertQuery = `
  //               INSERT INTO student
  //               (student_code, school_id, student_name, roll_no, class_id, student_section,
  //                mobile_number, whatsapp_number, aadhaar_number, student_subject, approved,
  //                approved_by, country, state, district, city, session_id, created_by, updated_by,
  //                created_at, updated_at, level, level_status)
  //               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
  //             `;

  //                   db.query(
  //                     insertQuery,
  //                     [
  //                       finalStudentCode,
  //                       school_id,
  //                       student_name,
  //                       formattedRollNo,
  //                       class_id,
  //                       student_section,
  //                       mobile_number,
  //                       whatsapp_number,
  //                       aadhaar_number,
  //                       subjectValue,
  //                       approved,
  //                       approved_by,
  //                       country,
  //                       state,
  //                       district,
  //                       city,
  //                       finalSessionId,
  //                       userId,
  //                       userId,
  //                       level,
  //                       level_status,
  //                     ],
  //                     (err, result) => {
  //                       if (err) return callback(err);

  //                       callback(null, result);
  //                     }
  //                   );
  //                 });
  //               });
  //             });
  //           }
  //         );
  //       }
  //     );
  //   });
  // },

  create: (studentData, userId, callback) => {
    const {
      school_id,
      student_name,
      class_id,
      student_section,
      mobile_number,
      whatsapp_number,
      aadhaar_number,
      student_subject,
      approved = 0,
      approved_by = null,
      country,
      state,
      district,
      city,
      level = 1,
      level_1 = "pending",
      level_2 = null,
      level_3 = null,
      level_4 = null,
      session_id,
    } = studentData;

    // Step 1: Resolve session_id (active or provided)
    const resolveSessionId = (next) => {
      if (session_id) {
        const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
        db.query(verifyQuery, [session_id], (err, result) => {
          if (err) return callback(err);
          if (result.length === 0)
            return callback(new Error("Invalid session ID selected"));
          return next(session_id);
        });
      } else {
        const sessionQuery = `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`;
        db.query(sessionQuery, (err, result) => {
          if (err) return callback(err);
          if (result.length === 0)
            return callback(new Error("No active session found"));
          return next(result[0].id);
        });
      }
    };

    resolveSessionId((finalSessionId) => {
      // Step 2: Check duplicate Aadhaar in same session
      const sameSessionCheck = `
      SELECT student_code FROM student 
      WHERE aadhaar_number = ? AND session_id = ?
      LIMIT 1
    `;
      db.query(
        sameSessionCheck,
        [aadhaar_number, finalSessionId],
        (err, sameSessionResult) => {
          if (err) return callback(err);
          if (sameSessionResult.length > 0) {
            return callback(
              new Error("This Aadhaar is already registered in this session")
            );
          }

          // Step 3: Check if Aadhaar exists in any session → reuse student_code
          const anySessionCheck = `
          SELECT student_code FROM student 
          WHERE aadhaar_number = ?
          ORDER BY id ASC LIMIT 1
        `;
          db.query(
            anySessionCheck,
            [aadhaar_number],
            (err, anySessionResult) => {
              if (err) return callback(err);

              const reuseStudentCode =
                anySessionResult.length > 0
                  ? anySessionResult[0].student_code
                  : null;

              // Step 4: Fetch school code
              const schoolQuery = `SELECT school_code FROM school WHERE id = ?`;
              db.query(schoolQuery, [school_id], (err, schoolResult) => {
                if (err) return callback(err);
                if (schoolResult.length === 0)
                  return callback(new Error("School not found"));

                const school_code = schoolResult[0].school_code;
                const rollPrefix = `${school_code}${class_id}${level}%`;

                // Step 5: Generate roll number
                const rollQuery = `
              SELECT roll_no FROM student 
              WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1
            `;
                db.query(rollQuery, [rollPrefix], (err, rollResult) => {
                  if (err) return callback(err);

                  let newRollNumber = 1;
                  if (rollResult.length > 0) {
                    const lastRoll = rollResult[0].roll_no || "";
                    const lastRollNumber = parseInt(lastRoll.slice(-2), 10);
                    if (!isNaN(lastRollNumber))
                      newRollNumber = lastRollNumber + 1;
                  }

                  const formattedRollNo = `${school_code}${class_id}${level}${String(
                    newRollNumber
                  ).padStart(2, "0")}`;

                  const subjectValue = student_subject
                    ? JSON.stringify(student_subject)
                    : null;

                  // Step 6: Generate NEW student_code if needed
                  const generateStudentCode = (cb) => {
                    if (reuseStudentCode) return cb(null, reuseStudentCode);

                    const studentCodePrefix = `GB-${finalSessionId}-`;
                    const studentCodeQuery = `
                  SELECT student_code FROM student 
                  WHERE session_id = ? AND student_code LIKE ? 
                  ORDER BY id DESC LIMIT 1
                `;
                    db.query(
                      studentCodeQuery,
                      [finalSessionId, `${studentCodePrefix}%`],
                      (err, result) => {
                        if (err) return cb(err);

                        let newStudentCodeNumber = 1;
                        if (result.length > 0) {
                          const lastStudentCode = result[0].student_code;
                          const lastNumber = parseInt(
                            lastStudentCode.split("-").pop(),
                            10
                          );
                          if (!isNaN(lastNumber))
                            newStudentCodeNumber = lastNumber + 1;
                        }

                        const generatedStudentCode = `${studentCodePrefix}${String(
                          newStudentCodeNumber
                        ).padStart(3, "0")}`;
                        cb(null, generatedStudentCode);
                      }
                    );
                  };

                  generateStudentCode((err, finalStudentCode) => {
                    if (err) return callback(err);

                    // Step 7: Insert student record with new level columns
                    const insertQuery = `
                  INSERT INTO student 
                  (student_code, school_id, student_name, roll_no, class_id, student_section, 
                   mobile_number, whatsapp_number, aadhaar_number, student_subject, approved, 
                   approved_by, country, state, district, city, session_id, created_by, updated_by, 
                   created_at, updated_at, level, level_1, level_2, level_3, level_4) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?)
                `;

                    db.query(
                      insertQuery,
                      [
                        finalStudentCode,
                        school_id,
                        student_name,
                        formattedRollNo,
                        class_id,
                        student_section,
                        mobile_number,
                        whatsapp_number,
                        aadhaar_number,
                        subjectValue,
                        approved,
                        approved_by,
                        country,
                        state,
                        district,
                        city,
                        finalSessionId,
                        userId,
                        userId,
                        level,
                        level_1,
                        level_2,
                        level_3,
                        level_4,
                      ],
                      (err, result) => {
                        if (err) return callback(err);
                        callback(null, result);
                      }
                    );
                  });
                });
              });
            }
          );
        }
      );
    });
  },

  // BULK UPLOAD
  // bulkCreate: (students, userId) => {
  //   return new Promise((resolve, reject) => {
  //     const requiredFields = [
  //       "school_id",
  //       "class_id",
  //       "student_name",
  //       "student_section",
  //       "aadhaar_number", // required now
  //     ];

  //     // Validate required fields
  //     const missingFields = students.reduce((acc, student, index) => {
  //       const missing = requiredFields.filter(
  //         (field) => student[field] == null || student[field] === ""
  //       );
  //       if (missing.length > 0) {
  //         acc.push(
  //           `Student at index ${index} missing fields: ${missing.join(", ")}`
  //         );
  //       }
  //       return acc;
  //     }, []);

  //     if (missingFields.length > 0) {
  //       return reject(
  //         new Error("Missing required fields", { cause: missingFields })
  //       );
  //     }

  //     // Utility: Get ID by name
  //     const getIdByName = (table, name) => {
  //       return new Promise((resolve, reject) => {
  //         const validTables = {
  //           countries: "name",
  //           states: "name",
  //           districts: "name",
  //           cities: "name",
  //           class: "name",
  //           subject_master: "name",
  //           school: "school_name",
  //         };
  //         const column = validTables[table];
  //         if (!column) return reject(new Error(`Invalid table: ${table}`));

  //         db.query(
  //           `SELECT id FROM ${table} WHERE ${column} = ? LIMIT 1`,
  //           [name.trim()],
  //           (err, result) => {
  //             if (err) return reject(err);
  //             if (result.length === 0)
  //               return reject(new Error(`${table} not found: ${name}`));
  //             resolve(result[0].id);
  //           }
  //         );
  //       });
  //     };

  //     const getActiveSession = () => {
  //       return new Promise((resolve, reject) => {
  //         db.query(
  //           `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`,
  //           (err, result) => {
  //             if (err) return reject(err);
  //             if (result.length === 0)
  //               return reject(new Error("No active session found"));
  //             resolve(result[0].id);
  //           }
  //         );
  //       });
  //     };

  //     const getSubjectIds = async (subjects) => {
  //       return Promise.all(
  //         subjects.map((s) => getIdByName("subject_master", s))
  //       );
  //     };

  //     const resolveSessionId = (manualSessionId) => {
  //       return new Promise((resolve, reject) => {
  //         if (manualSessionId) {
  //           db.query(
  //             `SELECT id FROM gowvell_session WHERE id = ?`,
  //             [manualSessionId],
  //             (err, result) => {
  //               if (err) return reject(err);
  //               if (result.length === 0)
  //                 return reject(new Error("Invalid session ID selected"));
  //               resolve(result[0].id);
  //             }
  //           );
  //         } else {
  //           getActiveSession().then(resolve).catch(reject);
  //         }
  //       });
  //     };

  //     // Normalize single student
  //     const normalizeStudent = async (student) => {
  //       const [
  //         schoolId,
  //         classId,
  //         countryId,
  //         stateId,
  //         districtId,
  //         cityId,
  //         sessionId,
  //       ] = await Promise.all([
  //         getIdByName("school", student.school_id),
  //         getIdByName("class", student.class_id),
  //         student.country
  //           ? getIdByName("countries", student.country)
  //           : Promise.resolve(null),
  //         student.state
  //           ? getIdByName("states", student.state)
  //           : Promise.resolve(null),
  //         student.district
  //           ? getIdByName("districts", student.district)
  //           : Promise.resolve(null),
  //         student.city
  //           ? getIdByName("cities", student.city)
  //           : Promise.resolve(null),
  //         resolveSessionId(student.session_id),
  //       ]);

  //       let subjects = student.student_subject || [];
  //       if (typeof subjects === "string") {
  //         subjects = subjects.trim().split(/\s+/);
  //       }
  //       const subjectIds = await getSubjectIds(subjects);

  //       return {
  //         ...student,
  //         school_id: schoolId,
  //         class_id: classId,
  //         country: countryId,
  //         state: stateId,
  //         district: districtId,
  //         city: cityId,
  //         session_id: sessionId,
  //         student_subject: subjectIds,
  //         level: student.level || 1,
  //         // level_status: student.level_status || "continue",
  //       };
  //     };

  //     // Main process
  //     const processStudents = async () => {
  //       const aadhaarList = students.map((s) => s.aadhaar_number);

  //       // Fetch Aadhaar matches with session_id and student_code
  //       const aadhaarMatches = await new Promise((resolve, reject) => {
  //         const query = `
  //         SELECT aadhaar_number, session_id, student_code
  //         FROM student
  //         WHERE aadhaar_number IN (?)`;
  //         db.query(query, [aadhaarList], (err, result) => {
  //           if (err) return reject(err);
  //           resolve(result);
  //         });
  //       });

  //       const aadhaarMap = {}; // aadhaar_number → student_code
  //       const sessionDup = new Set(); // aadhaar numbers already in same session

  //       for (const row of aadhaarMatches) {
  //         aadhaarMap[row.aadhaar_number] = row.student_code;
  //       }

  //       const normalized = [];
  //       const errors = [];

  //       for (const student of students) {
  //         try {
  //           const normalizedStudent = await normalizeStudent(student);

  //           // Check if Aadhaar exists in SAME session → reject
  //           const found = aadhaarMatches.find(
  //             (m) =>
  //               m.aadhaar_number === normalizedStudent.aadhaar_number &&
  //               m.session_id === normalizedStudent.session_id
  //           );
  //           if (found) {
  //             sessionDup.add(normalizedStudent.aadhaar_number);
  //             throw new Error(
  //               `Aadhaar ${normalizedStudent.aadhaar_number} already exists in this session`
  //             );
  //           }

  //           normalized.push(normalizedStudent);
  //         } catch (err) {
  //           errors.push({ student: student.student_name, error: err.message });
  //         }
  //       }

  //       if (sessionDup.size > 0) {
  //         throw new Error("Duplicate Aadhaar numbers found in this session", {
  //           cause: Array.from(sessionDup),
  //         });
  //       }

  //       if (normalized.length === 0) {
  //         throw new Error("All student records failed validation", {
  //           cause: errors,
  //         });
  //       }

  //       // Group by school-class-level
  //       const grouped = normalized.reduce((acc, student) => {
  //         const key = `${student.school_id}-${student.class_id}-${
  //           student.level || 1
  //         }`;
  //         acc[key] = acc[key] || [];
  //         acc[key].push(student);
  //         return acc;
  //       }, {});

  //       return { grouped, errors, aadhaarMap };
  //     };

  //     // Assign roll numbers and student_code
  //     const assignRollNumbersAndCodes = async (
  //       group,
  //       school_id,
  //       class_id,
  //       level,
  //       session_id,
  //       aadhaarMap
  //     ) => {
  //       const rollPrefix = await new Promise((resolve, reject) =>
  //         db.query(
  //           `SELECT school_code FROM school WHERE id = ?`,
  //           [school_id],
  //           (err, result) => {
  //             if (err) return reject(err);
  //             if (result.length === 0)
  //               return reject(new Error("School code not found"));
  //             resolve(result[0].school_code + class_id + level);
  //           }
  //         )
  //       );

  //       const lastRollResult = await new Promise((resolve, reject) =>
  //         db.query(
  //           `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`,
  //           [`${rollPrefix}%`],
  //           (err, result) => (err ? reject(err) : resolve(result))
  //         )
  //       );
  //       let rollNum =
  //         lastRollResult.length > 0
  //           ? parseInt(lastRollResult[0].roll_no.slice(-2)) + 1
  //           : 1;

  //       const studentCodePrefix = `GB-${session_id}-`;
  //       const lastCodeResult = await new Promise((resolve, reject) =>
  //         db.query(
  //           `SELECT student_code FROM student
  //          WHERE session_id = ? AND student_code LIKE ?
  //          ORDER BY id DESC LIMIT 1`,
  //           [session_id, `${studentCodePrefix}%`],
  //           (err, result) => (err ? reject(err) : resolve(result))
  //         )
  //       );
  //       let studentCodeNum =
  //         lastCodeResult.length > 0
  //           ? parseInt(lastCodeResult[0].student_code.split("-").pop(), 10) + 1
  //           : 1;

  //       return group.map((student) => {
  //         const roll_no = `${rollPrefix}${String(rollNum++).padStart(2, "0")}`;
  //         const student_code = aadhaarMap[student.aadhaar_number]
  //           ? aadhaarMap[student.aadhaar_number] // reuse if Aadhaar exists in another session
  //           : `${studentCodePrefix}${String(studentCodeNum++).padStart(
  //               3,
  //               "0"
  //             )}`; // new code
  //         return { ...student, roll_no, student_code };
  //       });
  //     };

  //     const insertStudents = (studentsToInsert) => {
  //       const query = `
  //       INSERT INTO student
  //       (student_code, school_id, student_name, roll_no, class_id, student_section,
  //        mobile_number, whatsapp_number, aadhaar_number, student_subject, country,
  //        state, district, city, session_id, approved, approved_by,
  //        created_by, updated_by, created_at, updated_at, level, level_status)
  //       VALUES ?`;

  //       const values = studentsToInsert.map((s) => [
  //         s.student_code,
  //         s.school_id,
  //         s.student_name,
  //         s.roll_no,
  //         s.class_id,
  //         s.student_section,
  //         s.mobile_number ?? null,
  //         s.whatsapp_number ?? null,
  //         s.aadhaar_number ?? null,
  //         JSON.stringify(s.student_subject),
  //         s.country,
  //         s.state,
  //         s.district,
  //         s.city,
  //         s.session_id,
  //         s.approved ?? 0,
  //         s.approved_by ?? null,
  //         userId,
  //         userId,
  //         new Date(),
  //         new Date(),
  //         s.level,
  //         s.level_status,
  //       ]);

  //       return new Promise((resolve, reject) => {
  //         db.beginTransaction((err) => {
  //           if (err) return reject(err);
  //           db.query(query, [values], (err, result) => {
  //             if (err) return db.rollback(() => reject(err));
  //             db.commit((err) => {
  //               if (err) return db.rollback(() => reject(err));
  //               resolve(result);
  //             });
  //           });
  //         });
  //       });
  //     };

  //     // Execute processStudents()
  //     processStudents()
  //       .then(async ({ grouped, errors, aadhaarMap }) => {
  //         const allToInsert = [];
  //         for (const key of Object.keys(grouped)) {
  //           const [school_id, class_id, level] = key.split("-").map(Number);
  //           const session_id = grouped[key][0].session_id;
  //           const withRollAndCodes = await assignRollNumbersAndCodes(
  //             grouped[key],
  //             school_id,
  //             class_id,
  //             level,
  //             session_id,
  //             aadhaarMap
  //           );
  //           allToInsert.push(...withRollAndCodes);
  //         }

  //         if (allToInsert.length === 0) {
  //           return reject(
  //             new Error("No valid students to insert", { cause: errors })
  //           );
  //         }

  //         const result = await insertStudents(allToInsert);
  //         resolve({
  //           insertedCount: result.affectedRows,
  //           errors: errors.length > 0 ? errors : undefined,
  //         });
  //       })
  //       .catch((err) => {
  //         if (
  //           err.message === "Duplicate Aadhaar numbers found in this session"
  //         ) {
  //           return reject(
  //             new Error("Duplicate Aadhaar numbers found in this session", {
  //               cause: err.cause,
  //             })
  //           );
  //         }
  //         reject(
  //           err.cause
  //             ? err
  //             : new Error("Student processing failed", { cause: [err.message] })
  //         );
  //       });
  //   });
  // },

  bulkCreate: (students, userId) => {
    return new Promise((resolve, reject) => {
      const requiredFields = [
        "school_id",
        "class_id",
        "student_name",
        "student_section",
        "aadhaar_number",
      ];

      // Validate required fields
      const missingFields = students.reduce((acc, student, index) => {
        const missing = requiredFields.filter(
          (field) => student[field] == null || student[field] === ""
        );
        if (missing.length > 0) {
          acc.push(
            `Student at index ${index} missing fields: ${missing.join(", ")}`
          );
        }
        return acc;
      }, []);

      if (missingFields.length > 0) {
        return reject(
          new Error("Missing required fields", { cause: missingFields })
        );
      }

      // Utility: Get ID by name
      const getIdByName = (table, name) => {
        return new Promise((resolve, reject) => {
          const validTables = {
            countries: "name",
            states: "name",
            districts: "name",
            cities: "name",
            class: "name",
            subject_master: "name",
            school: "school_name",
          };
          const column = validTables[table];
          if (!column) return reject(new Error(`Invalid table: ${table}`));

          db.query(
            `SELECT id FROM ${table} WHERE ${column} = ? LIMIT 1`,
            [name.trim()],
            (err, result) => {
              if (err) return reject(err);
              if (result.length === 0)
                return reject(new Error(`${table} not found: ${name}`));
              resolve(result[0].id);
            }
          );
        });
      };

      const getActiveSession = () => {
        return new Promise((resolve, reject) => {
          db.query(
            `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`,
            (err, result) => {
              if (err) return reject(err);
              if (result.length === 0)
                return reject(new Error("No active session found"));
              resolve(result[0].id);
            }
          );
        });
      };

      const getSubjectIds = async (subjects) => {
        return Promise.all(
          subjects.map((s) => getIdByName("subject_master", s))
        );
      };

      const resolveSessionId = (manualSessionId) => {
        return new Promise((resolve, reject) => {
          if (manualSessionId) {
            db.query(
              `SELECT id FROM gowvell_session WHERE id = ?`,
              [manualSessionId],
              (err, result) => {
                if (err) return reject(err);
                if (result.length === 0)
                  return reject(new Error("Invalid session ID selected"));
                resolve(result[0].id);
              }
            );
          } else {
            getActiveSession().then(resolve).catch(reject);
          }
        });
      };

      // Normalize single student
      const normalizeStudent = async (student) => {
        const [
          schoolId,
          classId,
          countryId,
          stateId,
          districtId,
          cityId,
          sessionId,
        ] = await Promise.all([
          getIdByName("school", student.school_id),
          getIdByName("class", student.class_id),
          student.country
            ? getIdByName("countries", student.country)
            : Promise.resolve(null),
          student.state
            ? getIdByName("states", student.state)
            : Promise.resolve(null),
          student.district
            ? getIdByName("districts", student.district)
            : Promise.resolve(null),
          student.city
            ? getIdByName("cities", student.city)
            : Promise.resolve(null),
          resolveSessionId(student.session_id),
        ]);

        let subjects = student.student_subject || [];
        if (typeof subjects === "string") {
          subjects = subjects.trim().split(/\s+/);
        }
        const subjectIds = await getSubjectIds(subjects);

        return {
          ...student,
          school_id: schoolId,
          class_id: classId,
          country: countryId,
          state: stateId,
          district: districtId,
          city: cityId,
          session_id: sessionId,
          student_subject: subjectIds,
          level: student.level || 1,
          level_1: "pending",
          level_2: null,
          level_3: null,
          level_4: null,
        };
      };

      // Main process
      const processStudents = async () => {
        const aadhaarList = students.map((s) => s.aadhaar_number);

        const aadhaarMatches = await new Promise((resolve, reject) => {
          const query = `
          SELECT aadhaar_number, session_id, student_code 
          FROM student 
          WHERE aadhaar_number IN (?)`;
          db.query(query, [aadhaarList], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });

        const aadhaarMap = {};
        const sessionDup = new Set();

        for (const row of aadhaarMatches) {
          aadhaarMap[row.aadhaar_number] = row.student_code;
        }

        const normalized = [];
        const errors = [];

        for (const student of students) {
          try {
            const normalizedStudent = await normalizeStudent(student);

            const found = aadhaarMatches.find(
              (m) =>
                m.aadhaar_number === normalizedStudent.aadhaar_number &&
                m.session_id === normalizedStudent.session_id
            );
            if (found) {
              sessionDup.add(normalizedStudent.aadhaar_number);
              throw new Error(
                `Aadhaar ${normalizedStudent.aadhaar_number} already exists in this session`
              );
            }

            normalized.push(normalizedStudent);
          } catch (err) {
            errors.push({ student: student.student_name, error: err.message });
          }
        }

        if (sessionDup.size > 0) {
          throw new Error("Duplicate Aadhaar numbers found in this session", {
            cause: Array.from(sessionDup),
          });
        }

        if (normalized.length === 0) {
          throw new Error("All student records failed validation", {
            cause: errors,
          });
        }

        const grouped = normalized.reduce((acc, student) => {
          const key = `${student.school_id}-${student.class_id}-${
            student.level || 1
          }`;
          acc[key] = acc[key] || [];
          acc[key].push(student);
          return acc;
        }, {});

        return { grouped, errors, aadhaarMap };
      };

      const assignRollNumbersAndCodes = async (
        group,
        school_id,
        class_id,
        level,
        session_id,
        aadhaarMap
      ) => {
        const rollPrefix = await new Promise((resolve, reject) =>
          db.query(
            `SELECT school_code FROM school WHERE id = ?`,
            [school_id],
            (err, result) => {
              if (err) return reject(err);
              if (result.length === 0)
                return reject(new Error("School code not found"));
              resolve(result[0].school_code + class_id + level);
            }
          )
        );

        const lastRollResult = await new Promise((resolve, reject) =>
          db.query(
            `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`,
            [`${rollPrefix}%`],
            (err, result) => (err ? reject(err) : resolve(result))
          )
        );
        let rollNum =
          lastRollResult.length > 0
            ? parseInt(lastRollResult[0].roll_no.slice(-2)) + 1
            : 1;

        const studentCodePrefix = `GB-${session_id}-`;
        const lastCodeResult = await new Promise((resolve, reject) =>
          db.query(
            `SELECT student_code FROM student 
           WHERE session_id = ? AND student_code LIKE ? 
           ORDER BY id DESC LIMIT 1`,
            [session_id, `${studentCodePrefix}%`],
            (err, result) => (err ? reject(err) : resolve(result))
          )
        );
        let studentCodeNum =
          lastCodeResult.length > 0
            ? parseInt(lastCodeResult[0].student_code.split("-").pop(), 10) + 1
            : 1;

        return group.map((student) => {
          const roll_no = `${rollPrefix}${String(rollNum++).padStart(2, "0")}`;
          const student_code = aadhaarMap[student.aadhaar_number]
            ? aadhaarMap[student.aadhaar_number]
            : `${studentCodePrefix}${String(studentCodeNum++).padStart(
                3,
                "0"
              )}`;
          return { ...student, roll_no, student_code };
        });
      };

      const insertStudents = (studentsToInsert) => {
        const query = `
        INSERT INTO student 
        (student_code, school_id, student_name, roll_no, class_id, student_section, 
         mobile_number, whatsapp_number, aadhaar_number, student_subject, country, 
         state, district, city, session_id, approved, approved_by, 
         created_by, updated_by, created_at, updated_at, 
         level, level_1, level_2, level_3, level_4)
        VALUES ?`;

        const values = studentsToInsert.map((s) => [
          s.student_code,
          s.school_id,
          s.student_name,
          s.roll_no,
          s.class_id,
          s.student_section,
          s.mobile_number ?? null,
          s.whatsapp_number ?? null,
          s.aadhaar_number ?? null,
          JSON.stringify(s.student_subject),
          s.country,
          s.state,
          s.district,
          s.city,
          s.session_id,
          s.approved ?? 0,
          s.approved_by ?? null,
          userId,
          userId,
          new Date(),
          new Date(),
          s.level,
          s.level_1,
          s.level_2,
          s.level_3,
          s.level_4,
        ]);

        return new Promise((resolve, reject) => {
          db.beginTransaction((err) => {
            if (err) return reject(err);
            db.query(query, [values], (err, result) => {
              if (err) return db.rollback(() => reject(err));
              db.commit((err) => {
                if (err) return db.rollback(() => reject(err));
                resolve(result);
              });
            });
          });
        });
      };

      // Execute processStudents()
      processStudents()
        .then(async ({ grouped, errors, aadhaarMap }) => {
          const allToInsert = [];
          for (const key of Object.keys(grouped)) {
            const [school_id, class_id, level] = key.split("-").map(Number);
            const session_id = grouped[key][0].session_id;
            const withRollAndCodes = await assignRollNumbersAndCodes(
              grouped[key],
              school_id,
              class_id,
              level,
              session_id,
              aadhaarMap
            );
            allToInsert.push(...withRollAndCodes);
          }

          if (allToInsert.length === 0) {
            return reject(
              new Error("No valid students to insert", { cause: errors })
            );
          }

          const result = await insertStudents(allToInsert);
          resolve({
            insertedCount: result.affectedRows,
            errors: errors.length > 0 ? errors : undefined,
          });
        })
        .catch((err) => {
          if (
            err.message === "Duplicate Aadhaar numbers found in this session"
          ) {
            return reject(
              new Error("Duplicate Aadhaar numbers found in this session", {
                cause: err.cause,
              })
            );
          }
          reject(
            err.cause
              ? err
              : new Error("Student processing failed", { cause: [err.message] })
          );
        });
    });
  },

  getAllStudent: (callback) => {
    const query = "SELECT * FROM student";
    db.query(query, callback);
  },

  //aadhaar number  get stduent
  getByAadhaar: (aadhaar_number, callback) => {
    const query = `
    SELECT 
      s.*,
      sch.school_name,
      c.name as country_name,
      st.name as state_name,
      d.name as district_name,
      ci.name as city_name
    FROM student s
    LEFT JOIN school sch ON s.school_id = sch.id
    LEFT JOIN countries c ON s.country = c.id
    LEFT JOIN states st ON s.state = st.id
    LEFT JOIN districts d ON s.district = d.id
    LEFT JOIN cities ci ON s.city = ci.id
    WHERE s.aadhaar_number = ?
  `;

    db.query(query, [aadhaar_number], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  //pagination and serch and get all data
  // getAll: (page = 1, limit = 10, search = "", callback) => {
  //   const offset = (page - 1) * limit;
  //   let whereClause = "";
  //   let queryParams = [];

  //   if (search && search.trim() !== "") {
  //     whereClause = `WHERE
  //     s.student_name LIKE ? OR
  //     s.roll_no LIKE ? OR
  //     sc.school_name LIKE ?`;

  //     for (let i = 0; i < 3; i++) queryParams.push(`%${search}%`);
  //   }

  //   const query = `
  //   SELECT
  //     s.*,
  //     sc.school_name
  //   FROM student s
  //   JOIN school sc ON s.school_id = sc.id
  //   ${whereClause}
  //   ORDER BY s.id DESC
  //   LIMIT ? OFFSET ?;
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) AS total
  //   FROM student s
  //   JOIN school sc ON s.school_id = sc.id
  //   ${whereClause};
  // `;

  //   db.query(countQuery, queryParams, (err, countResult) => {
  //     if (err) return callback(err);

  //     const totalRecords = countResult[0].total;
  //     const totalPages = Math.ceil(totalRecords / limit);
  //     const nextPage = page < totalPages ? page + 1 : null;
  //     const prevPage = page > 1 ? page - 1 : null;

  //     db.query(
  //       query,
  //       [...queryParams, parseInt(limit), parseInt(offset)],
  //       (err, result) => {
  //         if (err) return callback(err);

  //         callback(null, {
  //           students: result,
  //           currentPage: page,
  //           nextPage,
  //           prevPage,
  //           totalPages,
  //           totalRecords,
  //         });
  //       }
  //     );
  //   });
  // },

  // pagination, search, and get all students by session_id
  // getAll: (page = 1, limit = 10, search = "", session_id, callback) => {
  //   const offset = (page - 1) * limit;
  //   let whereClause = "WHERE s.session_id = ?"; // Always filter by session_id
  //   let queryParams = [session_id];

  //   if (search && search.trim() !== "") {
  //     whereClause += ` AND (s.student_name LIKE ? OR s.roll_no LIKE ? OR sc.school_name LIKE ?)`;
  //     for (let i = 0; i < 3; i++) queryParams.push(`%${search}%`);
  //   }

  //   const query = `
  //   SELECT s.*, sc.school_name
  //   FROM student s
  //   JOIN school sc ON s.school_id = sc.id
  //   ${whereClause}
  //   ORDER BY s.id DESC
  //   LIMIT ? OFFSET ?;
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) AS total
  //   FROM student s
  //   JOIN school sc ON s.school_id = sc.id
  //   ${whereClause};
  // `;

  //   db.query(countQuery, queryParams, (err, countResult) => {
  //     if (err) return callback(err);

  //     const totalRecords = countResult[0].total;
  //     const totalPages = Math.ceil(totalRecords / limit);
  //     const nextPage = page < totalPages ? page + 1 : null;
  //     const prevPage = page > 1 ? page - 1 : null;

  //     db.query(
  //       query,
  //       [...queryParams, parseInt(limit), parseInt(offset)],
  //       (err, result) => {
  //         if (err) return callback(err);
  //         callback(null, {
  //           students: result,
  //           currentPage: page,
  //           nextPage,
  //           prevPage,
  //           totalPages,
  //           totalRecords,
  //         });
  //       }
  //     );
  //   });
  // },

  getAll: (page = 1, limit = 10, search = "", session_id = null, callback) => {
    const offset = (page - 1) * limit;

    // Base where clause to handle both cases
    let whereClause = "";
    let queryParams = [];

    if (session_id) {
      // Explicit session filter
      whereClause = "WHERE s.session_id = ?";
      queryParams.push(session_id);
    } else {
      // Automatically pick active session
      whereClause = "WHERE gs.status = 'active'";
    }

    if (search && search.trim() !== "") {
      whereClause += ` AND (s.student_name LIKE ? OR s.roll_no LIKE ? OR sc.school_name LIKE ?)`;
      for (let i = 0; i < 3; i++) queryParams.push(`%${search}%`);
    }

    const query = `
    SELECT s.*, sc.school_name, gs.session
    FROM student s
    JOIN school sc ON s.school_id = sc.id
    JOIN gowvell_session gs ON s.session_id = gs.id
    ${whereClause}
    ORDER BY s.id DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM student s
    JOIN school sc ON s.school_id = sc.id
    JOIN gowvell_session gs ON s.session_id = gs.id
    ${whereClause};
  `;

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      db.query(
        query,
        [...queryParams, parseInt(limit), parseInt(offset)],
        (err, result) => {
          if (err) return callback(err);
          callback(null, {
            students: result,
            currentPage: page,
            nextPage,
            prevPage,
            totalPages,
            totalRecords,
          });
        }
      );
    });
  },

  getById: (id, callback) => {
    const query = "SELECT * FROM student WHERE id = ?";
    db.query(query, [id], callback);
  },

  update: (id, studentData, callback) => {
    const {
      school_id,
      student_name,
      class_id,
      student_section,
      mobile_number,
      whatsapp_number,
      aadhaar_number,
      student_subject,
      approved,
      approved_by,
      country,
      state,
      district,
      city,
    } = studentData;

    const query = `
        UPDATE student 
        SET school_id = ?, student_name = ?, class_id = ?, student_section = ?, 
            mobile_number = ?, whatsapp_number = ?, aadhaar_number = ?, student_subject = ?, 
            approved = ?, approved_by = ?, country = ?, state = ?, district = ?, city = ?, 
            updated_at = NOW() 
        WHERE id = ?
    `;

    db.query(
      query,
      [
        school_id,
        student_name,
        class_id,
        student_section,
        mobile_number,
        whatsapp_number,
        aadhaar_number,
        student_subject,
        approved,
        approved_by,
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
    const query = "DELETE FROM student WHERE id = ?";
    db.query(query, [id], callback);
  },

  //for omr issues student data by school class subject
  // getStudentsByFilters: (schoolName, classList, subjectList, callback) => {
  //   if (!classList.length || !subjectList.length) {
  //     return callback(null, { students: [], totalCount: 0 });
  //   }

  //   const placeholders = classList.map(() => "?").join(",");
  //   const subjectPlaceholders = subjectList.map(() => "?").join(",");

  //   const subjectJsonConditions = subjectList
  //     .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
  //     .join(" OR ");

  //   const dataQuery = `
  //     SELECT
  //       s.id,
  //       s.roll_no,
  //       s.student_name,
  //       s.school_id,
  //       c.name AS class_name,
  //       sub.name AS subject_name
  //     FROM student s
  //     LEFT JOIN class c ON s.class_id = c.id
  //     LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //       ON TRUE
  //     LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //     WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
  //       AND s.class_id IN (${placeholders})
  //       AND (${subjectJsonConditions})
  //       AND sub.id IN (${subjectPlaceholders})
  //     ORDER BY s.id
  //   `;

  //   const countQuery = `
  //     SELECT COUNT(DISTINCT s.id) as total_count
  //     FROM student s
  //     LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //       ON TRUE
  //     WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
  //       AND s.class_id IN (${placeholders})
  //       AND (${subjectJsonConditions})
  //   `;

  //   const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
  //   const dataParams = [
  //     schoolName,
  //     ...classList,
  //     ...jsonSubjectParams,
  //     ...subjectList,
  //   ];
  //   const countParams = [schoolName, ...classList, ...jsonSubjectParams];

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);

  //       const totalCount = countResult[0].total_count || 0;
  //       callback(null, { students, totalCount });
  //     });
  //   });
  // },

  // getStudentsByFilters: (schoolName, classList, subjectList, callback) => {
  //   if (!classList.length || !subjectList.length) {
  //     return callback(null, { students: [], totalCount: 0, exam_date: null });
  //   }

  //   const placeholders = classList.map(() => "?").join(",");
  //   const subjectPlaceholders = subjectList.map(() => "?").join(",");

  //   const subjectJsonConditions = subjectList
  //     .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
  //     .join(" OR ");

  //   const dataQuery = `
  //   SELECT
  //     s.id,
  //     s.roll_no,
  //     s.student_name,
  //     s.school_id,
  //     c.name AS class_name,
  //     sub.name AS subject_name
  //   FROM student s
  //   LEFT JOIN class c ON s.class_id = c.id
  //   LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //     ON TRUE
  //   LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //   WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  //     AND sub.id IN (${subjectPlaceholders})
  //   ORDER BY s.id
  // `;

  //   const countQuery = `
  //   SELECT COUNT(DISTINCT s.id) as total_count
  //   FROM student s
  //   LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //     ON TRUE
  //   WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  // `;

  //   // New query to fetch exam_date for this school
  //   const examQuery = `
  //   SELECT DATE(exam_date) AS exam_date
  //   FROM exam
  //   WHERE school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
  //   ORDER BY exam_date DESC
  //   LIMIT 1
  // `;

  //   const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
  //   const dataParams = [
  //     schoolName,
  //     ...classList,
  //     ...jsonSubjectParams,
  //     ...subjectList,
  //   ];
  //   const countParams = [schoolName, ...classList, ...jsonSubjectParams];

  //   // Step 1 → Get exam_date first
  //   db.query(examQuery, [schoolName], (examErr, examResult) => {
  //     if (examErr) return callback(examErr);

  //     const exam_date = examResult.length > 0 ? examResult[0].exam_date : null;

  //     // Step 2 → Fetch students
  //     db.query(dataQuery, dataParams, (err, students) => {
  //       if (err) return callback(err);

  //       // Step 3 → Fetch count
  //       db.query(countQuery, countParams, (countErr, countResult) => {
  //         if (countErr) return callback(countErr);

  //         const totalCount = countResult[0]?.total_count || 0;
  //         callback(null, { students, totalCount, exam_date });
  //       });
  //     });
  //   });
  // },

  getStudentsByFilters: (
    schoolName,
    classList,
    subjectList,
    level,
    callback
  ) => {
    if (!classList.length || !subjectList.length) {
      return callback(null, { students: [], totalCount: 0, exam_date: null });
    }

    const placeholders = classList.map(() => "?").join(",");
    const subjectPlaceholders = subjectList.map(() => "?").join(",");
    const subjectJsonConditions = subjectList
      .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
      .join(" OR ");

    // 👉 Level condition (use your existing columns)
    let levelCondition = "";
    if (level === "level_2") {
      levelCondition = "AND s.level_2 IS NOT NULL";
    }
    // If level_1 selected → no extra condition

    const dataQuery = `
    SELECT 
      s.id,
      s.roll_no,
      s.student_name,
      s.school_id,
      s.level_1,
      s.level_2,
      c.name AS class_name,
      sub.name AS subject_name
    FROM student s
    LEFT JOIN class c ON s.class_id = c.id
    LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss 
      ON TRUE
    LEFT JOIN subject_master sub ON ss.subject_id = sub.id
    WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
      AND s.class_id IN (${placeholders})
      AND (${subjectJsonConditions})
      AND sub.id IN (${subjectPlaceholders})
      ${levelCondition}
    ORDER BY s.id
  `;

    const countQuery = `
    SELECT COUNT(DISTINCT s.id) as total_count 
    FROM student s
    LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss 
      ON TRUE
    WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
      AND s.class_id IN (${placeholders})
      AND (${subjectJsonConditions})
      ${levelCondition}
  `;

    const examQuery = `
    SELECT DATE(exam_date) AS exam_date
    FROM exam
    WHERE school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
    ORDER BY exam_date DESC
    LIMIT 1
  `;

    const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
    const dataParams = [
      schoolName,
      ...classList,
      ...jsonSubjectParams,
      ...subjectList,
    ];
    const countParams = [schoolName, ...classList, ...jsonSubjectParams];

    db.query(examQuery, [schoolName], (examErr, examResult) => {
      if (examErr) return callback(examErr);

      const exam_date = examResult.length > 0 ? examResult[0].exam_date : null;

      db.query(dataQuery, dataParams, (err, students) => {
        if (err) return callback(err);

        db.query(countQuery, countParams, (countErr, countResult) => {
          if (countErr) return callback(countErr);

          const totalCount = countResult[0]?.total_count || 0;
          callback(null, { students, totalCount, exam_date });
        });
      });
    });
  },

  getClassNames: (classIds, callback) => {
    if (!classIds.length) return callback(null, []);
    const placeholders = classIds.map(() => "?").join(",");
    const query = `
      SELECT id, name AS class_name 
      FROM class 
      WHERE id IN (${placeholders})
    `;
    db.query(query, classIds, callback);
  },

  getSubjectNames: (subjectIds, callback) => {
    if (!subjectIds.length) return callback(null, []);
    const placeholders = subjectIds.map(() => "?").join(",");
    const query = `
      SELECT id, name AS subject_name 
      FROM subject_master 
      WHERE id IN (${placeholders})
    `;
    db.query(query, subjectIds, callback);
  },

  //omr receipt
  getStudents: (
    schoolName,
    classList,
    subjectList,
    rollnoclasssubject,
    callback
  ) => {
    const placeholders = classList.map(() => "?").join(",");
    const subjectPlaceholders = subjectList.map(() => "?").join(",");

    const subjectJsonConditions = subjectList
      .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
      .join(" OR ");

    let dataQuery = `
    SELECT
      s.id,
      s.roll_no,
      s.student_name,
      s.school_id,
      s.student_section,
      s.mobile_number,
      s.status,
      c.name AS class_name,
      sub.name AS subject_names
    FROM student s
    LEFT JOIN class c ON s.class_id = c.id
    LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
      ON TRUE
    LEFT JOIN subject_master sub ON ss.subject_id = sub.id
    WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
      AND s.class_id IN (${placeholders})
      AND (${subjectJsonConditions})
      AND sub.id IN (${subjectPlaceholders})
  `;

    let countQuery = `
    SELECT COUNT(*) as total_count
    FROM student s
    WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
      AND s.class_id IN (${placeholders})
      AND (${subjectJsonConditions})
  `;

    let dataParams = [
      schoolName,
      ...classList,
      ...subjectList.map((sub) => JSON.stringify(sub)),
      ...subjectList,
    ];

    let countParams = [
      schoolName,
      ...classList,
      ...subjectList.map((sub) => JSON.stringify(sub)),
    ];

    // If filtering by roll no, class, subject
    if (rollnoclasssubject) {
      const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");

      dataQuery += `
      AND s.roll_no = ? 
      AND s.class_id = ? 
      AND JSON_CONTAINS(s.student_subject, ?) 
      AND sub.id = ?
    `;
      countQuery += `
      AND s.roll_no = ? 
      AND s.class_id = ? 
      AND JSON_CONTAINS(s.student_subject, ?)
    `;

      dataParams.push(
        rollNo,
        classId,
        JSON.stringify(Number(subjectId)),
        subjectId
      );
      countParams.push(rollNo, classId, JSON.stringify(Number(subjectId)));
    }

    db.query(dataQuery, dataParams, (err, students) => {
      if (err) return callback(err);

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) return callback(countErr);

        const totalCount = countResult[0].total_count;
        callback(null, { students, totalCount });
      });
    });
  },

  getClassNames: (classIds, callback) => {
    if (!classIds.length) return callback(null, []);
    const placeholders = classIds.map(() => "?").join(",");
    const query = `
    SELECT id, name AS class_name 
    FROM class 
    WHERE id IN (${placeholders})
  `;
    db.query(query, classIds, callback);
  },

  getSubjectNames: (subjectIds, callback) => {
    if (!subjectIds.length) return callback(null, []);
    const placeholders = subjectIds.map(() => "?").join(",");
    const query = `
    SELECT id, name AS subject_name 
    FROM subject_master 
    WHERE id IN (${placeholders})
  `;
    db.query(query, subjectIds, callback);
  },

  //student attendance
  // getStudentforAttendance: (schoolId, classList, subjectList, callback) => {
  //   if (!classList.length || !subjectList.length) {
  //     return callback(null, { students: [], totalCount: 0, exam_date: null });
  //   }

  //   const classPlaceholders = classList.map(() => "?").join(",");
  //   const studentSubjectConditions = subjectList
  //     .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
  //     .join(" OR ");
  //   const examClassConditions = classList
  //     .map(() => `JSON_CONTAINS(e.classes_id, ?)`)
  //     .join(" OR ");
  //   const examSubjectConditions = subjectList
  //     .map(() => `JSON_CONTAINS(e.subjects_id, ?)`)
  //     .join(" OR ");

  //   const dataQuery = `
  //   SELECT s.id, s.roll_no, s.student_name, s.school_id, c.name AS class_name,
  //          GROUP_CONCAT(DISTINCT sub.name) AS subject_names
  //   FROM student s
  //   LEFT JOIN class c ON s.class_id = c.id
  //   LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss ON TRUE
  //   LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //   WHERE s.school_id = ?
  //     AND s.class_id IN (${classPlaceholders})
  //     AND (${studentSubjectConditions})
  //   GROUP BY s.id
  // `;

  //   const countQuery = `
  //   SELECT COUNT(DISTINCT s.id) AS total_count
  //   FROM student s
  //   WHERE s.school_id = ?
  //     AND s.class_id IN (${classPlaceholders})
  //     AND (${studentSubjectConditions})
  // `;

  //   const examQuery = `
  //   SELECT e.id, e.exam_date
  //   FROM exam e
  //   WHERE e.school_id = ?
  //     AND (${examClassConditions})
  //     AND (${examSubjectConditions})
  //   ORDER BY e.exam_date DESC
  //   LIMIT 1
  // `;

  //   const jsonSubjectParamsStudents = subjectList.map((sub) =>
  //     JSON.stringify(sub)
  //   );
  //   const jsonClassParamsExam = classList.map((cls) => JSON.stringify(cls));
  //   const jsonSubjectParamsExam = subjectList.map((sub) => JSON.stringify(sub));

  //   const dataParams = [schoolId, ...classList, ...jsonSubjectParamsStudents];
  //   const countParams = [schoolId, ...classList, ...jsonSubjectParamsStudents];
  //   const examParams = [
  //     schoolId,
  //     ...jsonClassParamsExam,
  //     ...jsonSubjectParamsExam,
  //   ];

  //   db.query(examQuery, examParams, (examErr, examResult) => {
  //     if (examErr) return callback(examErr);

  //     const exam_id = examResult.length > 0 ? examResult[0].id : null;
  //     const exam_date = examResult.length > 0 ? examResult[0].exam_date : null;

  //     db.query(dataQuery, dataParams, (err, students) => {
  //       if (err) return callback(err);

  //       db.query(countQuery, countParams, (countErr, countResult) => {
  //         if (countErr) return callback(countErr);

  //         const totalCount = countResult[0]?.total_count || 0;
  //         callback(null, { students, totalCount, exam_id, exam_date });
  //       });
  //     });
  //   });
  // },
  getStudentforAttendance: (schoolId, classList, subjectList, callback) => {
    if (!classList.length || !subjectList.length) {
      return callback(null, { students: [], totalCount: 0, exam_dates: [] });
    }

    const classPlaceholders = classList.map(() => "?").join(",");
    const studentSubjectConditions = subjectList
      .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
      .join(" OR ");

    const dataQuery = `
    SELECT s.id, s.roll_no, s.student_name, s.school_id, c.name AS class_name,
           GROUP_CONCAT(DISTINCT sub.name) AS subject_names
    FROM student s
    LEFT JOIN class c ON s.class_id = c.id
    LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss ON TRUE
    LEFT JOIN subject_master sub ON ss.subject_id = sub.id
    WHERE s.school_id = ?
      AND s.class_id IN (${classPlaceholders})
      AND (${studentSubjectConditions})
    GROUP BY s.id
  `;

    const countQuery = `
    SELECT COUNT(DISTINCT s.id) AS total_count
    FROM student s
    WHERE s.school_id = ?
      AND s.class_id IN (${classPlaceholders})
      AND (${studentSubjectConditions})
  `;

    // New query to fetch exam dates per class + subject combination
    const examQuery = `
    SELECT 
      e.id AS exam_id, 
      e.exam_date,
      ec.value AS class_id, 
      es.value AS subject_id
    FROM exam e
    JOIN JSON_TABLE(e.classes_id, '$[*]' COLUMNS (value INT PATH '$')) ec
    JOIN JSON_TABLE(e.subjects_id, '$[*]' COLUMNS (value INT PATH '$')) es
    WHERE e.school_id = ?
      AND ec.value IN (${classPlaceholders})
      AND es.value IN (${subjectList.map(() => "?").join(",")})
    ORDER BY e.exam_date DESC
  `;

    const jsonSubjectParamsStudents = subjectList.map((sub) =>
      JSON.stringify(sub)
    );
    const dataParams = [schoolId, ...classList, ...jsonSubjectParamsStudents];
    const countParams = [schoolId, ...classList, ...jsonSubjectParamsStudents];
    const examParams = [schoolId, ...classList, ...subjectList];

    db.query(dataQuery, dataParams, (err, students) => {
      if (err) return callback(err);

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) return callback(countErr);
        const totalCount = countResult[0]?.total_count || 0;

        db.query(examQuery, examParams, (examErr, examResult) => {
          if (examErr) return callback(examErr);

          callback(null, { students, totalCount, exam_dates: examResult });
        });
      });
    });
  },

  getClassNames: (classIds, callback) => {
    if (!classIds.length) return callback(null, []);
    const placeholders = classIds.map(() => "?").join(",");
    const query = `
      SELECT id, name AS class_name
      FROM class
      WHERE id IN (${placeholders})
    `;
    db.query(query, classIds, callback);
  },

  getSubjectNames: (subjectIds, callback) => {
    if (!subjectIds.length) return callback(null, []);
    const placeholders = subjectIds.map(() => "?").join(",");
    const query = `
      SELECT id, name AS subject_name
      FROM subject_master
      WHERE id IN (${placeholders})
    `;
    db.query(query, subjectIds, callback);
  },

  //student report
  // getStudentforReport: (schoolId, classList, subjectList, callback) => {
  //   // Case 1: Only schoolId → get ALL students under the school
  //   if (!classList.length && !subjectList.length) {
  //     const dataQuery = `
  //     SELECT
  //       s.id,
  //       s.roll_no,
  //       s.student_name,
  //       s.mobile_number,
  //       s.school_id,
  //       c.name AS class_name,
  //       GROUP_CONCAT(DISTINCT sub.name) AS subject_names
  //     FROM student s
  //     LEFT JOIN class c ON s.class_id = c.id
  //     LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //       ON TRUE
  //     LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //     WHERE s.school_id = ?
  //     GROUP BY s.id
  //   `;

  //     const countQuery = `
  //     SELECT COUNT(DISTINCT s.id) AS total_count
  //     FROM student s
  //     WHERE s.school_id = ?
  //   `;

  //     db.query(dataQuery, [schoolId], (err, students) => {
  //       if (err) return callback(err);
  //       db.query(countQuery, [schoolId], (countErr, countResult) => {
  //         if (countErr) return callback(countErr);
  //         const totalCount = countResult[0]?.total_count || 0;
  //         callback(null, { students, totalCount });
  //       });
  //     });
  //     return;
  //   }

  //   // Case 2: schoolId + classList only → get all students in those classes (no subject filter)
  //   if (classList.length && !subjectList.length) {
  //     const classPlaceholders = classList.map(() => "?").join(",");
  //     const dataQuery = `
  //     SELECT
  //       s.id,
  //       s.roll_no,
  //       s.student_name,
  //       s.mobile_number,
  //       s.school_id,
  //       c.name AS class_name,
  //       GROUP_CONCAT(DISTINCT sub.name) AS subject_names
  //     FROM student s
  //     LEFT JOIN class c ON s.class_id = c.id
  //     LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //       ON TRUE
  //     LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //     WHERE s.school_id = ?
  //       AND s.class_id IN (${classPlaceholders})
  //     GROUP BY s.id
  //   `;

  //     const countQuery = `
  //     SELECT COUNT(DISTINCT s.id) AS total_count
  //     FROM student s
  //     WHERE s.school_id = ?
  //       AND s.class_id IN (${classPlaceholders})
  //   `;

  //     const params = [schoolId, ...classList];
  //     db.query(dataQuery, params, (err, students) => {
  //       if (err) return callback(err);
  //       db.query(countQuery, params, (countErr, countResult) => {
  //         if (countErr) return callback(countErr);
  //         const totalCount = countResult[0]?.total_count || 0;
  //         callback(null, { students, totalCount });
  //       });
  //     });
  //     return;
  //   }

  //   // Case 3: schoolId + classList + subjectList → original filtering logic
  //   if (!classList.length || !subjectList.length) {
  //     return callback(null, { students: [], totalCount: 0 });
  //   }

  //   const classPlaceholders = classList.map(() => "?").join(",");
  //   const subjectJsonConditions = subjectList
  //     .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
  //     .join(" OR ");

  //   const dataQuery = `
  //   SELECT
  //     s.id,
  //     s.roll_no,
  //     s.student_name,
  //     s.mobile_number,
  //     s.school_id,
  //     c.name AS class_name,
  //     GROUP_CONCAT(DISTINCT sub.name) AS subject_names
  //   FROM student s
  //   LEFT JOIN class c ON s.class_id = c.id
  //   LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //     ON TRUE
  //   LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //   WHERE s.school_id = ?
  //     AND s.class_id IN (${classPlaceholders})
  //     AND (${subjectJsonConditions})
  //   GROUP BY s.id
  // `;

  //   const countQuery = `
  //   SELECT COUNT(DISTINCT s.id) AS total_count
  //   FROM student s
  //   WHERE s.school_id = ?
  //     AND s.class_id IN (${classPlaceholders})
  //     AND (${subjectJsonConditions})
  // `;

  //   const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
  //   const dataParams = [schoolId, ...classList, ...jsonSubjectParams];
  //   const countParams = [schoolId, ...classList, ...jsonSubjectParams];

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);
  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);
  //       const totalCount = countResult[0]?.total_count || 0;
  //       callback(null, { students, totalCount });
  //     });
  //   });
  // },

  getStudentforReport: (
    schoolId,
    classList,
    subjectList,
    session_id,
    callback
  ) => {
    // Step 1: Resolve session_id first
    const resolveSessionId = (next) => {
      if (session_id) {
        const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
        db.query(verifyQuery, [session_id], (err, result) => {
          if (err) return callback(err);
          if (result.length === 0)
            return callback(new Error("Invalid session ID selected"));
          return next(session_id);
        });
      } else {
        const sessionQuery = `
        SELECT id 
        FROM gowvell_session 
        WHERE status = 'active' 
        ORDER BY id DESC 
        LIMIT 1
      `;
        db.query(sessionQuery, (err, result) => {
          if (err) return callback(err);
          if (result.length === 0)
            return callback(new Error("No active session found"));
          return next(result[0].id);
        });
      }
    };

    // Step 2: Once session_id is resolved, run student queries
    resolveSessionId((resolvedSessionId) => {
      // Case 1: Only schoolId → get ALL students under the school
      if (!classList.length && !subjectList.length) {
        const dataQuery = `
        SELECT
          s.id,
          s.roll_no,
          s.student_name,
          s.mobile_number,
          s.school_id,
          c.name AS class_name,
          GROUP_CONCAT(DISTINCT sub.name) AS subject_names
        FROM student s
        LEFT JOIN class c ON s.class_id = c.id
        LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
          ON TRUE
        LEFT JOIN subject_master sub ON ss.subject_id = sub.id
        WHERE s.school_id = ? AND s.session_id = ?
        GROUP BY s.id
      `;

        const countQuery = `
        SELECT COUNT(DISTINCT s.id) AS total_count
        FROM student s
        WHERE s.school_id = ? AND s.session_id = ?
      `;

        db.query(dataQuery, [schoolId, resolvedSessionId], (err, students) => {
          if (err) return callback(err);
          db.query(
            countQuery,
            [schoolId, resolvedSessionId],
            (countErr, countResult) => {
              if (countErr) return callback(countErr);
              const totalCount = countResult[0]?.total_count || 0;
              callback(null, { students, totalCount });
            }
          );
        });
        return;
      }

      // Case 2: schoolId + classList only → all students in those classes
      if (classList.length && !subjectList.length) {
        const classPlaceholders = classList.map(() => "?").join(",");
        const dataQuery = `
        SELECT
          s.id,
          s.roll_no,
          s.student_name,
          s.mobile_number,
          s.school_id,
          c.name AS class_name,
          GROUP_CONCAT(DISTINCT sub.name) AS subject_names
        FROM student s
        LEFT JOIN class c ON s.class_id = c.id
        LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
          ON TRUE
        LEFT JOIN subject_master sub ON ss.subject_id = sub.id
        WHERE s.school_id = ? AND s.session_id = ?
          AND s.class_id IN (${classPlaceholders})
        GROUP BY s.id
      `;

        const countQuery = `
        SELECT COUNT(DISTINCT s.id) AS total_count
        FROM student s
        WHERE s.school_id = ? AND s.session_id = ?
          AND s.class_id IN (${classPlaceholders})
      `;

        const params = [schoolId, resolvedSessionId, ...classList];
        db.query(dataQuery, params, (err, students) => {
          if (err) return callback(err);
          db.query(countQuery, params, (countErr, countResult) => {
            if (countErr) return callback(countErr);
            const totalCount = countResult[0]?.total_count || 0;
            callback(null, { students, totalCount });
          });
        });
        return;
      }

      // Case 3: schoolId + classList + subjectList → subject filtering
      if (!classList.length || !subjectList.length) {
        return callback(null, { students: [], totalCount: 0 });
      }

      const classPlaceholders = classList.map(() => "?").join(",");
      const subjectJsonConditions = subjectList
        .map(() => `JSON_CONTAINS(s.student_subject, ? )`)
        .join(" OR ");

      const dataQuery = `
      SELECT
        s.id,
        s.roll_no,
        s.student_name,
        s.mobile_number,
        s.school_id,
        c.name AS class_name,
        GROUP_CONCAT(DISTINCT sub.name) AS subject_names
      FROM student s
      LEFT JOIN class c ON s.class_id = c.id
      LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
        ON TRUE
      LEFT JOIN subject_master sub ON ss.subject_id = sub.id
      WHERE s.school_id = ? AND s.session_id = ?
        AND s.class_id IN (${classPlaceholders})
        AND (${subjectJsonConditions})
      GROUP BY s.id
    `;

      const countQuery = `
      SELECT COUNT(DISTINCT s.id) AS total_count
      FROM student s
      WHERE s.school_id = ? AND s.session_id = ?
        AND s.class_id IN (${classPlaceholders})
        AND (${subjectJsonConditions})
    `;

      const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
      const dataParams = [
        schoolId,
        resolvedSessionId,
        ...classList,
        ...jsonSubjectParams,
      ];
      const countParams = [
        schoolId,
        resolvedSessionId,
        ...classList,
        ...jsonSubjectParams,
      ];

      db.query(dataQuery, dataParams, (err, students) => {
        if (err) return callback(err);
        db.query(countQuery, countParams, (countErr, countResult) => {
          if (countErr) return callback(countErr);
          const totalCount = countResult[0]?.total_count || 0;
          callback(null, { students, totalCount });
        });
      });
    });
  },

  getClassNames: (classIds, callback) => {
    if (!classIds.length) return callback(null, []);
    const placeholders = classIds.map(() => "?").join(",");
    const query = `
      SELECT id, name AS class_name
      FROM class
      WHERE id IN (${placeholders})
    `;
    db.query(query, classIds, callback);
  },

  getSubjectNames: (subjectIds, callback) => {
    if (!subjectIds.length) return callback(null, []);
    const placeholders = subjectIds.map(() => "?").join(",");
    const query = `
      SELECT id, name AS subject_name
      FROM subject_master
      WHERE id IN (${placeholders})
    `;
    db.query(query, subjectIds, callback);
  },
};

export default Student;
