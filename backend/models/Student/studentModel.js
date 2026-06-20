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
              new Error("This Aadhaar is already registered in this session"),
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
                    newRollNumber,
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
                            10,
                          );
                          if (!isNaN(lastNumber))
                            newStudentCodeNumber = lastNumber + 1;
                        }

                        const generatedStudentCode = `${studentCodePrefix}${String(
                          newStudentCodeNumber,
                        ).padStart(3, "0")}`;
                        cb(null, generatedStudentCode);
                      },
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
                      },
                    );
                  });
                });
              });
            },
          );
        },
      );
    });
  },

  // BULK UPLOAD

  bulkCreate: (students, userId) => {
    return new Promise((resolve, reject) => {
      const requiredFields = [
        "school_id",
        "class_id",
        "student_name",
        "student_section",
        "aadhaar_number",
      ];

      // === 1. Validate required fields + attach row index ===
      const missingErrors = [];
      students.forEach((s, idx) => {
        const missing = requiredFields.filter(
          (f) => s[f] == null || s[f] === "",
        );
        if (missing.length > 0) {
          missingErrors.push({
            rowIndex: idx + 2,
            message: `Missing: ${missing.join(", ")}`,
          });
        }
      });

      if (missingErrors.length > 0) {
        return reject(
          new Error("Missing required fields", { cause: missingErrors }),
        );
      }

      // === 2. Utility: Get ID by name ===
      const getIdByName = (table, name) => {
        return new Promise((resolve, reject) => {
          const valid = {
            countries: "name",
            states: "name",
            districts: "name",
            cities: "name",
            class: "name",
            subject_master: "name",
            school: "school_name",
          };
          const col = valid[table];
          if (!col) return reject(new Error(`Invalid table: ${table}`));

          db.query(
            `SELECT id FROM ${table} WHERE ${col} = ? LIMIT 1`,
            [name.trim()],
            (err, res) => {
              if (err) return reject(err);
              if (res.length === 0)
                return reject(new Error(`${table} not found: ${name}`));
              resolve(res[0].id);
            },
          );
        });
      };

      const getActiveSession = () =>
        new Promise((resolve, reject) => {
          db.query(
            `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`,
            (err, res) => {
              if (err) return reject(err);
              if (res.length === 0)
                return reject(new Error("No active session"));
              resolve(res[0].id);
            },
          );
        });

      const resolveSessionId = (manualId) =>
        manualId
          ? new Promise((resolve, reject) =>
              db.query(
                `SELECT id FROM gowvell_session WHERE id = ?`,
                [manualId],
                (err, res) => {
                  if (err) return reject(err);
                  if (res.length === 0)
                    return reject(new Error("Invalid session ID"));
                  resolve(res[0].id);
                },
              ),
            )
          : getActiveSession();

      const getSubjectIds = (subjects) =>
        Promise.all(subjects.map((s) => getIdByName("subject_master", s)));

      // === 3. Normalize one student + preserve rowIndex ===
      // const normalizeStudent = async (student, rowIndex) => {
      //   const [
      //     schoolId,
      //     classId,
      //     countryId,
      //     stateId,
      //     districtId,
      //     cityId,
      //     sessionId,
      //   ] = await Promise.all([
      //     getIdByName("school", student.school_id),
      //     getIdByName("class", student.class_id),
      //     student.country ? getIdByName("countries", student.country) : null,
      //     student.state ? getIdByName("states", student.state) : null,
      //     student.district ? getIdByName("districts", student.district) : null,
      //     student.city ? getIdByName("cities", student.city) : null,
      //     resolveSessionId(student.session_id),
      //   ]);

      //   let subjects = student.student_subject || [];
      //   if (typeof subjects === "string")
      //     subjects = subjects.trim().split(/\s+/);
      //   const subjectIds = await getSubjectIds(subjects);

      //   return {
      //     ...student,
      //     __rowIndex: rowIndex,
      //     school_id: schoolId,
      //     class_id: classId,
      //     country: countryId,
      //     state: stateId,
      //     district: districtId,
      //     city: cityId,
      //     session_id: sessionId,
      //     student_subject: subjectIds,
      //     level: student.level || 1,
      //     level_1: "pending",
      //     level_2: null,
      //     level_3: null,
      //     level_4: null,
      //   };
      // };

      // === 3. Normalize one student + preserve rowIndex ===
      const normalizeStudent = async (student, rowIndex) => {
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
          student.country ? getIdByName("countries", student.country) : null,
          student.state ? getIdByName("states", student.state) : null,
          student.district ? getIdByName("districts", student.district) : null,
          student.city ? getIdByName("cities", student.city) : null,
          resolveSessionId(student.session_id),
        ]);

        let subjects = student.student_subject || [];
        if (typeof subjects === "string")
          subjects = subjects.trim().split(/\s+/);
        const subjectIds = await getSubjectIds(subjects);

        return {
          ...student,
          __rowIndex: rowIndex,
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
          // Preserve manual roll_no if provided and looks valid
          roll_no:
            student.roll_no && String(student.roll_no).trim()
              ? String(student.roll_no).trim()
              : null,
        };
      };

      // === 4. Main processing ===
      const process = async () => {
        // Build Aadhaar → row map
        const aadhaarToRow = {};
        students.forEach((s, i) => {
          if (s.aadhaar_number) aadhaarToRow[s.aadhaar_number] = i + 2;
        });

        // Check existing Aadhaar in DB
        const aadhaarList = students.map((s) => s.aadhaar_number);
        const existing = await new Promise((res, rej) =>
          db.query(
            `SELECT aadhaar_number, session_id FROM student WHERE aadhaar_number IN (?)`,
            [aadhaarList],
            (e, r) => (e ? rej(e) : res(r)),
          ),
        );

        const existingMap = {};
        existing.forEach((r) => (existingMap[r.aadhaar_number] = r.session_id));

        const normalized = [];
        const errors = [];

        for (let i = 0; i < students.length; i++) {
          const s = students[i];
          const rowIdx = i + 2;

          try {
            const norm = await normalizeStudent(s, rowIdx);

            // Duplicate in same session?
            if (
              existingMap[s.aadhaar_number] &&
              existingMap[s.aadhaar_number] === norm.session_id
            ) {
              throw new Error(`Aadhaar already exists in this session`);
            }

            normalized.push(norm);
          } catch (err) {
            errors.push({
              rowIndex: rowIdx,
              message: err.message,
            });
          }
        }

        if (errors.length === students.length) {
          throw new Error("All records failed", { cause: errors });
        }

        // Group for roll number assignment
        const grouped = normalized.reduce((acc, s) => {
          const key = `${s.school_id}-${s.class_id}-${s.level || 1}`;
          acc[key] = acc[key] || [];
          acc[key].push(s);
          return acc;
        }, {});

        return { grouped, errors, aadhaarToRow };
      };

      // === 5. Assign roll_no & student_code ===
      // const assignRollAndCode = async (
      //   group,
      //   school_id,
      //   class_id,
      //   level,
      //   session_id,
      //   aadhaarMap
      // ) => {
      //   const prefixRes = await new Promise((res, rej) =>
      //     db.query(
      //       `SELECT school_code FROM school WHERE id = ?`,
      //       [school_id],
      //       (e, r) => (e ? rej(e) : res(r))
      //     )
      //   );
      //   const rollPrefix = prefixRes[0].school_code + class_id + (level || 1);

      //   const lastRoll = await new Promise((res, rej) =>
      //     db.query(
      //       `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`,
      //       [`${rollPrefix}%`],
      //       (e, r) => (e ? rej(e) : res(r))
      //     )
      //   );
      //   let rollNum =
      //     lastRoll.length > 0
      //       ? parseInt(lastRoll[0].roll_no.slice(-2), 10) + 1
      //       : 1;

      //   const codePrefix = `GB-${session_id}-`;
      //   const lastCode = await new Promise((res, rej) =>
      //     db.query(
      //       `SELECT student_code FROM student WHERE session_id = ? AND student_code LIKE ? ORDER BY id DESC LIMIT 1`,
      //       [session_id, `${codePrefix}%`],
      //       (e, r) => (e ? rej(e) : res(r))
      //     )
      //   );
      //   let codeNum =
      //     lastCode.length > 0
      //       ? parseInt(lastCode[0].student_code.split("-").pop(), 10) + 1
      //       : 1;

      //   return group.map((s) => {
      //     const roll_no = `${rollPrefix}${String(rollNum++).padStart(2, "0")}`;
      //     const student_code = aadhaarMap[s.aadhaar_number]
      //       ? aadhaarMap[s.aadhaar_number]
      //       : `${codePrefix}${String(codeNum++).padStart(3, "0")}`;
      //     return { ...s, roll_no, student_code };
      //   });
      // };

      // === 5. Assign roll_no (manual or auto) + FULL duplicate protection ===
      const assignRollAndCode = async (
        group,
        school_id,
        class_id,
        level,
        session_id,
        aadhaarMap,
      ) => {
        // Get school code
        const [schoolRow] = await new Promise((resolve, reject) => {
          db.query(
            `SELECT school_code FROM school WHERE id = ?`,
            [school_id],
            (err, results) => {
              if (err) return reject(err);
              resolve(results);
            },
          );
        });

        if (!schoolRow) throw new Error("School not found");

        const rollPrefix = schoolRow.school_code + class_id + (level || 1);

        // 1. Find highest existing roll_no in DB with this prefix
        const [lastDbRoll] = await new Promise((resolve, reject) => {
          db.query(
            `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`,
            [`${rollPrefix}%`],
            (err, results) => {
              if (err) return reject(err);
              resolve(results || []);
            },
          );
        });

        let nextAutoRoll = 1;
        if (lastDbRoll) {
          const lastNum = lastDbRoll.roll_no.slice(-2);
          nextAutoRoll = parseInt(lastNum, 10) + 1;
        }

        // 2. Collect manual roll_nos and detect duplicates within this batch
        const usedRollNos = new Set();
        const rollNoErrors = [];

        for (const student of group) {
          if (student.roll_no) {
            const roll = String(student.roll_no).trim();
            if (usedRollNos.has(roll)) {
              rollNoErrors.push({
                rowIndex: student.__rowIndex,
                message: `Duplicate roll_no in upload: ${roll}`,
              });
            } else {
              usedRollNos.add(roll);
            }
          }
        }

        // 3. Check if any manual roll_no already exists in database
        if (usedRollNos.size > 0) {
          const placeholders = Array(usedRollNos.size).fill("?").join(",");
          const existingRolls = await new Promise((resolve, reject) => {
            db.query(
              `SELECT roll_no FROM student WHERE roll_no IN (${placeholders})`,
              Array.from(usedRollNos),
              (err, results) => {
                if (err) return reject(err);
                resolve(results || []);
              },
            );
          });

          for (const row of existingRolls) {
            const conflictedStudent = group.find(
              (s) => String(s.roll_no).trim() === row.roll_no,
            );
            if (conflictedStudent) {
              rollNoErrors.push({
                rowIndex: conflictedStudent.__rowIndex,
                message: `Roll No already exists in database: ${row.roll_no}`,
              });
              usedRollNos.delete(row.roll_no); // Prevent reuse
            }
          }
        }

        // 4. If any error → throw all at once (so frontend gets full list)
        if (rollNoErrors.length > 0) {
          throw Object.assign(new Error("Roll number conflicts detected"), {
            cause: rollNoErrors,
          });
        }

        // 5. Generate student_code (unchanged logic)
        const codePrefix = `GB-${session_id}-`;
        const [lastCodeRow] = await new Promise((resolve, reject) => {
          db.query(
            `SELECT student_code FROM student 
       WHERE session_id = ? AND student_code LIKE ? 
       ORDER BY id DESC LIMIT 1`,
            [session_id, `${codePrefix}%`],
            (err, results) => {
              if (err) return reject(err);
              resolve(results || []);
            },
          );
        });

        let nextCodeNum = 1;
        if (lastCodeRow) {
          const lastNum = lastCodeRow.student_code.split("-").pop();
          nextCodeNum = parseInt(lastNum, 10) + 1;
        }

        // 6. Final assignment: manual or auto roll_no
        const finalStudents = group.map((student) => {
          let finalRollNo;

          if (student.roll_no) {
            // Use manual roll_no (already validated as unique)
            finalRollNo = String(student.roll_no).trim();
          } else {
            // Auto generate – skip if already used by manual ones
            let candidate;
            do {
              candidate = `${rollPrefix}${String(nextAutoRoll).padStart(
                2,
                "0",
              )}`;
              if (!usedRollNos.has(candidate)) break;
              nextAutoRoll++;
            } while (true);

            finalRollNo = candidate;
            nextAutoRoll++;
            usedRollNos.add(finalRollNo);
          }

          const student_code = aadhaarMap[student.aadhaar_number]
            ? aadhaarMap[student.aadhaar_number]
            : `${codePrefix}${String(nextCodeNum++).padStart(3, "0")}`;

          return {
            ...student,
            roll_no: finalRollNo,
            student_code,
          };
        });

        return finalStudents;
      };

      // === 6. Insert ===
      const insert = (list) => {
        const sql = `
          INSERT INTO student 
          (student_code, school_id, student_name, roll_no, class_id, student_section,
           mobile_number, whatsapp_number, aadhaar_number, student_subject, country,
           state, district, city, session_id, approved, approved_by,
           created_by, updated_by, created_at, updated_at,
           level, level_1, level_2, level_3, level_4)
          VALUES ?`;

        const values = list.map((s) => [
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
          0,
          null,
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

        return new Promise((res, rej) => {
          db.beginTransaction((err) => {
            if (err) return rej(err);
            db.query(sql, [values], (err, result) => {
              if (err) return db.rollback(() => rej(err));
              db.commit((e) => (e ? db.rollback(() => rej(e)) : res(result)));
            });
          });
        });
      };

      // === 7. Execute ===
      process()
        .then(async ({ grouped, errors: procErrors, aadhaarToRow }) => {
          const toInsert = [];

          for (const key of Object.keys(grouped)) {
            const [school_id, class_id, level] = key.split("-").map(Number);
            const session_id = grouped[key][0].session_id;
            const withCodes = await assignRollAndCode(
              grouped[key],
              school_id,
              class_id,
              level,
              session_id,
              {},
            );
            toInsert.push(...withCodes);
          }

          if (toInsert.length === 0) {
            return reject(new Error("No valid records", { cause: procErrors }));
          }

          const result = await insert(toInsert);
          resolve({
            insertedCount: result.affectedRows,
            errors: procErrors.length ? procErrors : undefined,
          });
        })
        .catch((err) => {
          if (err.cause && Array.isArray(err.cause)) {
            return reject(err);
          }
          reject(
            new Error("Processing failed", {
              cause: [{ rowIndex: null, message: err.message }],
            }),
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
  // getAll: (page = 1, limit = 10, search = "", session_id = null, callback) => {
  //   const offset = (page - 1) * limit;

  //   // Base where clause to handle both cases
  //   let whereClause = "";
  //   let queryParams = [];

  //   if (session_id) {
  //     // Explicit session filter
  //     whereClause = "WHERE s.session_id = ?";
  //     queryParams.push(session_id);
  //   } else {
  //     // Automatically pick active session
  //     whereClause = "WHERE gs.status = 'active'";
  //   }

  //   if (search && search.trim() !== "") {
  //     whereClause += ` AND (s.student_name LIKE ? OR s.roll_no LIKE ? OR sc.school_name LIKE ?)`;
  //     for (let i = 0; i < 3; i++) queryParams.push(`%${search}%`);
  //   }

  //   const query = `
  //   SELECT s.*, sc.school_name, gs.session
  //   FROM student s
  //   JOIN school sc ON s.school_id = sc.id
  //   JOIN gowvell_session gs ON s.session_id = gs.id
  //   ${whereClause}
  //   ORDER BY s.id DESC
  //   LIMIT ? OFFSET ?;
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) AS total
  //   FROM student s
  //   JOIN school sc ON s.school_id = sc.id
  //   JOIN gowvell_session gs ON s.session_id = gs.id
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

    let whereConditions = [];
    let queryParams = [];

    // 🎯 Session filter
    if (session_id) {
      whereConditions.push("s.session_id = ?");
      queryParams.push(session_id);
    } else {
      whereConditions.push("gs.status = 'active'");
    }

    // 🔍 Global search across student fields + class name
    if (search && search.trim() !== "") {
      const columnsToSearch = [
        "s.student_code",
        "s.school_id",
        "s.student_name",
        "s.roll_no",
        "c.name", // <-- search by class name
        "sc.school_name",
        "s.student_section",
        "s.mobile_number",
        "s.whatsapp_number",
        "s.aadhaar_number",
        "s.student_subject",
        "s.approved",
        "s.approved_by",
        "s.country",
        "s.state",
        "s.district",
        "s.city",
      ];

      const likeSearch = `%${search}%`;
      const searchConditions = columnsToSearch
        .map((col) => `${col} LIKE ?`)
        .join(" OR ");
      whereConditions.push(`(${searchConditions})`);

      columnsToSearch.forEach(() => queryParams.push(likeSearch));
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const query = `
    SELECT s.*, sc.school_name, gs.session, c.name AS class_name
    FROM student s
    JOIN school sc ON s.school_id = sc.id
    JOIN gowvell_session gs ON s.session_id = gs.id
    JOIN class c ON s.class_id = c.id
    ${whereClause}
    ORDER BY s.id DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM student s
    JOIN school sc ON s.school_id = sc.id
    JOIN gowvell_session gs ON s.session_id = gs.id
    JOIN class c ON s.class_id = c.id
    ${whereClause};
  `;

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      db.query(
        query,
        [...queryParams, Number(limit), Number(offset)],
        (err, result) => {
          if (err) return callback(err);

          callback(null, {
            students: result,
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            totalPages,
            totalRecords,
          });
        },
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
      callback,
    );
  },

  delete: (id, callback) => {
    const query = "DELETE FROM student WHERE id = ?";
    db.query(query, [id], callback);
  },

  //for omr issues student data by school class subject
  getStudentsByFilters: (
    school_id,
    classList,
    subjectList,
    level,
    callback,
  ) => {
    if (!classList.length || !subjectList.length) {
      return callback(null, {
        students: [],
        totalCount: 0,
        exam_date: null,
        center_name: null,
        school_level: null,
      });
    }

    // 🧩 Dynamic placeholders
    const classPlaceholders = classList.map(() => "?").join(",");
    const subjectPlaceholders = subjectList.map(() => "?").join(",");
    const subjectJsonConditions = subjectList
      .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
      .join(" OR ");

    // 🧩 Multi-school WHERE condition
    const schoolCondition = Array.isArray(school_id)
      ? `s.school_id IN (${school_id.map(() => "?").join(",")})`
      : `s.school_id = ?`;

    let levelCondition = "";
    if (level === "level_2") {
      levelCondition = "AND s.level_2 IS NOT NULL";
    }

    // 🔹 Fetch students
    const dataQuery = `
    SELECT 
  s.id,
  s.roll_no,
  s.student_name,
  s.school_id,
  sch.school_name,
  sch.school_address,
  s.level_1,
  s.level_2,
  s.level_3,
  s.level_4,
  c.name AS class_name,
  sub.name AS subject_name
FROM student s
LEFT JOIN school sch ON s.school_id = sch.id   -- ✅ ADD THIS
LEFT JOIN class c ON s.class_id = c.id
LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss 
  ON TRUE
LEFT JOIN subject_master sub ON ss.subject_id = sub.id
WHERE ${schoolCondition}
  AND s.class_id IN (${classPlaceholders})
  AND (${subjectJsonConditions})
  AND sub.id IN (${subjectPlaceholders})
  ${levelCondition}
ORDER BY s.id
  `;

    // 🔹 Count total
    const countQuery = `
    SELECT COUNT(DISTINCT s.id) AS total_count
    FROM student s
    LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss 
      ON TRUE
    WHERE ${schoolCondition}
      AND s.class_id IN (${classPlaceholders})
      AND (${subjectJsonConditions})
      ${levelCondition}
  `;

    // 🔹 Get latest exam date (JSON-based school_id)
    const examQuery = `
    SELECT DATE(exam_date) AS exam_date
    FROM exam
    WHERE ${
      Array.isArray(school_id)
        ? school_id
            .map(() => `JSON_CONTAINS(school_id, CAST(? AS JSON))`)
            .join(" OR ")
        : `JSON_CONTAINS(school_id, CAST(? AS JSON))`
    }
    ORDER BY exam_date DESC
    LIMIT 1
  `;

    // 🔹 Get center name (JSON-based school_id)
    const centerQuery = `
    SELECT c.center_name
    FROM assign_center ac
    JOIN center c ON ac.assign_center_name_id = c.id
    WHERE ${
      Array.isArray(school_id)
        ? school_id
            .map(() => `JSON_CONTAINS(ac.school_id, CAST(? AS JSON))`)
            .join(" OR ")
        : `JSON_CONTAINS(ac.school_id, CAST(? AS JSON))`
    }
    LIMIT 1
  `;

    // 🔹 Detect ongoing level
    const ongoingLevelQuery = `
    SELECT 
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM student s 
          WHERE ${schoolCondition} AND s.level_4 = 'ongoing'
        ) THEN 'level_4'
        WHEN EXISTS (
          SELECT 1 FROM student s 
          WHERE ${schoolCondition} AND s.level_3 = 'ongoing'
        ) THEN 'level_3'
        WHEN EXISTS (
          SELECT 1 FROM student s 
          WHERE ${schoolCondition} AND s.level_2 = 'ongoing'
        ) THEN 'level_2'
        WHEN EXISTS (
          SELECT 1 FROM student s 
          WHERE ${schoolCondition} AND s.level_1 = 'ongoing'
        ) THEN 'level_1'
        ELSE NULL 
      END AS school_level
  `;

    // 🧩 Parameters
    const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
    const schoolParams = Array.isArray(school_id) ? school_id : [school_id];

    const dataParams = [
      ...schoolParams,
      ...classList,
      ...jsonSubjectParams,
      ...subjectList,
    ];
    const countParams = [...schoolParams, ...classList, ...jsonSubjectParams];
    const examParams = schoolParams.map((id) => JSON.stringify(id));
    const centerParams = schoolParams.map((id) => JSON.stringify(id));
    const levelParams = [
      ...schoolParams,
      ...schoolParams,
      ...schoolParams,
      ...schoolParams,
    ];

    // 🧩 Step 1: Get exam date
    db.query(examQuery, examParams, (examErr, examResult) => {
      if (examErr) return callback(examErr);
      const exam_date = examResult.length > 0 ? examResult[0].exam_date : null;

      // 🧩 Step 2: Get center name
      db.query(centerQuery, centerParams, (centerErr, centerResult) => {
        if (centerErr) return callback(centerErr);
        const center_name =
          centerResult.length > 0 ? centerResult[0].center_name : null;

        // 🧩 Step 3: Get ongoing level
        db.query(ongoingLevelQuery, levelParams, (levelErr, levelResult) => {
          if (levelErr) return callback(levelErr);
          const school_level = levelResult[0]?.school_level || null;

          // 🧩 Step 4: Get students
          db.query(dataQuery, dataParams, (err, students) => {
            if (err) return callback(err);

            // 🧩 Step 5: Get total count
            db.query(countQuery, countParams, (countErr, countResult) => {
              if (countErr) return callback(countErr);

              const totalCount = countResult[0]?.total_count || 0;

              // 🧩 Step 6: Final callback
              callback(null, {
                students,
                totalCount,
                exam_date,
                center_name,
                school_level,
              });
            });
          });
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

  // getStudents: (
  //   schoolName,
  //   classList,
  //   subjectList,
  //   rollnoclasssubject,
  //   callback
  // ) => {
  //   const placeholders = classList.map(() => "?").join(",");
  //   const subjectPlaceholders = subjectList.map(() => "?").join(",");

  //   const subjectJsonConditions = subjectList
  //     .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
  //     .join(" OR ");

  //   let dataQuery = `
  //   SELECT
  //     s.id,
  //     s.roll_no,
  //     s.student_name,
  //     s.school_id,
  //     s.student_section,
  //     s.mobile_number,
  //     c.name AS class_name,
  //     sub.name AS subject_names
  //   FROM student s
  //   LEFT JOIN class c ON s.class_id = c.id
  //   LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //     ON TRUE
  //   LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //   WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  //     AND sub.id IN (${subjectPlaceholders})
  // `;

  //   let countQuery = `
  //   SELECT COUNT(*) as total_count
  //   FROM student s
  //   WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  // `;

  //   let dataParams = [
  //     schoolName,
  //     ...classList,
  //     ...subjectList.map((sub) => JSON.stringify(sub)),
  //     ...subjectList,
  //   ];

  //   let countParams = [
  //     schoolName,
  //     ...classList,
  //     ...subjectList.map((sub) => JSON.stringify(sub)),
  //   ];

  //   // If filtering by roll no, class, subject
  //   if (rollnoclasssubject) {
  //     const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");

  //     dataQuery += `
  //     AND s.roll_no = ?
  //     AND s.class_id = ?
  //     AND JSON_CONTAINS(s.student_subject, ?)
  //     AND sub.id = ?
  //   `;
  //     countQuery += `
  //     AND s.roll_no = ?
  //     AND s.class_id = ?
  //     AND JSON_CONTAINS(s.student_subject, ?)
  //   `;

  //     dataParams.push(
  //       rollNo,
  //       classId,
  //       JSON.stringify(Number(subjectId)),
  //       subjectId
  //     );
  //     countParams.push(rollNo, classId, JSON.stringify(Number(subjectId)));
  //   }

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);

  //       const totalCount = countResult[0].total_count;
  //       callback(null, { students, totalCount });
  //     });
  //   });
  // },

  //   getStudents: (
  //   schoolId,
  //   classList,
  //   subjectList,
  //   rollnoclasssubject,
  //   callback
  // ) => {
  //   const placeholders = classList.map(() => "?").join(",");
  //   const subjectPlaceholders = subjectList.map(() => "?").join(",");

  //   const subjectJsonConditions = subjectList
  //     .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
  //     .join(" OR ");

  //   let dataQuery = `
  //     SELECT
  //       s.id AS student_id,
  //       s.roll_no,
  //       s.student_name,
  //       s.school_id,
  //       s.student_section,
  //       s.mobile_number,
  //       c.name AS class_name,
  //       sub.id AS subject_id,
  //       sub.name AS subject_names,
  //       COALESCE(o.status, 'Pending') AS status
  //     FROM student s
  //     LEFT JOIN class c ON s.class_id = c.id
  //     LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //       ON TRUE
  //     LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //     LEFT JOIN omr_receipt o
  //       ON o.school_id = s.school_id
  //       AND o.class_id = s.class_id
  //       AND o.subject_id = sub.id
  //       AND o.roll_no = s.roll_no
  //     WHERE s.school_id = ?
  //       AND s.class_id IN (${placeholders})
  //       AND (${subjectJsonConditions})
  //       AND sub.id IN (${subjectPlaceholders})
  //   `;

  //   let countQuery = `
  //     SELECT COUNT(*) as total_count
  //     FROM student s
  //     WHERE s.school_id = ?
  //       AND s.class_id IN (${placeholders})
  //       AND (${subjectJsonConditions})
  //   `;

  //   let dataParams = [
  //     schoolId,
  //     ...classList,
  //     ...subjectList.map((sub) => JSON.stringify(sub)),
  //     ...subjectList,
  //   ];

  //   let countParams = [
  //     schoolId,
  //     ...classList,
  //     ...subjectList.map((sub) => JSON.stringify(sub)),
  //   ];

  //   // ✅ Filter when rollno-class-subject selected
  //   if (rollnoclasssubject) {
  //     const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");

  //     dataQuery += `
  //       AND s.roll_no = ?
  //       AND s.class_id = ?
  //       AND JSON_CONTAINS(s.student_subject, ?)
  //       AND sub.id = ?
  //     `;
  //     countQuery += `
  //       AND s.roll_no = ?
  //       AND s.class_id = ?
  //       AND JSON_CONTAINS(s.student_subject, ?)
  //     `;

  //     dataParams.push(
  //       rollNo,
  //       classId,
  //       JSON.stringify(Number(subjectId)),
  //       subjectId
  //     );
  //     countParams.push(rollNo, classId, JSON.stringify(Number(subjectId)));
  //   }

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);

  //       const totalCount = countResult[0].total_count;

  //       // ✅ STEP: If rollnoclasssubject provided, insert/update omr_receipt
  //       if (rollnoclasssubject && students.length > 0) {
  //         const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");
  //         const student = students[0];

  //         const insertQuery = `
  //           INSERT INTO omr_receipt (
  //             school_id,
  //             class_id,
  //             subject_id,
  //             roll_no,
  //             student_id,
  //             mobile_number,
  //             student_section,
  //             status,
  //             created_at
  //           )
  //           VALUES (?, ?, ?, ?, ?, ?, ?, 'Success', NOW())
  //           ON DUPLICATE KEY UPDATE
  //             status = 'Success',
  //             mobile_number = VALUES(mobile_number),
  //             student_section = VALUES(student_section),
  //             updated_at = NOW()
  //         `;

  //         const insertParams = [
  //           schoolId,
  //           classId,
  //           subjectId,
  //           rollNo,
  //           student.student_id,
  //           student.mobile_number,
  //           student.student_section,
  //         ];

  //         db.query(insertQuery, insertParams, (insertErr) => {
  //           if (insertErr) {
  //             console.error("Error inserting/updating OMR receipt:", insertErr);
  //           }

  //           // ✅ Reflect immediate success in JSON output
  //           students.forEach((stu) => {
  //             if (
  //               stu.roll_no === rollNo &&
  //               String(stu.subject_id) === String(subjectId)
  //             ) {
  //               stu.status = "Success";
  //             }
  //           });

  //           callback(null, { students, totalCount });
  //         });
  //       } else {
  //         callback(null, { students, totalCount });
  //       }
  //     });
  //   });
  // },

  //====================
  // getStudents: (
  //   schoolId,
  //   classList,
  //   subjectList,
  //   rollnoclasssubject,
  //   callback
  // ) => {
  //   const placeholders = classList.map(() => "?").join(",");
  //   const subjectPlaceholders = subjectList.map(() => "?").join(",");

  //   const subjectJsonConditions = subjectList
  //     .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
  //     .join(" OR ");

  //   let dataQuery = `
  //   SELECT
  //     s.id AS student_id,
  //     s.roll_no,
  //     s.student_name,
  //     s.school_id,
  //     s.student_section,
  //     s.mobile_number,
  //     c.name AS class_name,
  //     sub.id AS subject_id,
  //     sub.name AS subject_names,
  //     COALESCE(o.status, 'Pending') AS status
  //   FROM student s
  //   LEFT JOIN class c ON s.class_id = c.id
  //   LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //     ON TRUE
  //   LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //   LEFT JOIN omr_receipt o
  //     ON o.school_id = s.school_id
  //     AND o.class_id = s.class_id
  //     AND o.subject_id = sub.id
  //     AND o.roll_no = s.roll_no
  //   WHERE s.school_id = ?
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  //     AND sub.id IN (${subjectPlaceholders})
  // `;

  //   let countQuery = `
  //   SELECT COUNT(*) as total_count
  //   FROM student s
  //   WHERE s.school_id = ?
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  // `;

  //   let dataParams = [
  //     schoolId,
  //     ...classList,
  //     ...subjectList.map((sub) => JSON.stringify(sub)),
  //     ...subjectList,
  //   ];

  //   let countParams = [
  //     schoolId,
  //     ...classList,
  //     ...subjectList.map((sub) => JSON.stringify(sub)),
  //   ];

  //   // ✅ Filter when rollno-class-subject selected
  //   if (rollnoclasssubject) {
  //     const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");

  //     dataQuery += `
  //     AND s.roll_no = ?
  //     AND s.class_id = ?
  //     AND JSON_CONTAINS(s.student_subject, ?)
  //     AND sub.id = ?
  //   `;
  //     countQuery += `
  //     AND s.roll_no = ?
  //     AND s.class_id = ?
  //     AND JSON_CONTAINS(s.student_subject, ?)
  //   `;

  //     dataParams.push(
  //       rollNo,
  //       classId,
  //       JSON.stringify(Number(subjectId)),
  //       subjectId
  //     );
  //     countParams.push(rollNo, classId, JSON.stringify(Number(subjectId)));
  //   }

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);

  //       const totalCount = countResult[0].total_count;

  //       // ✅ STEP: If rollnoclasssubject provided, insert/update omr_receipt
  //       if (rollnoclasssubject && students.length > 0) {
  //         const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");
  //         const student = students[0];

  //         // 🔍 First check if already exists with Success
  //         const checkQuery = `
  //         SELECT id, status
  //         FROM omr_receipt
  //         WHERE school_id = ?
  //           AND class_id = ?
  //           AND subject_id = ?
  //           AND roll_no = ?
  //       `;
  //         const checkParams = [schoolId, classId, subjectId, rollNo];

  //         db.query(checkQuery, checkParams, (checkErr, existing) => {
  //           if (checkErr) return callback(checkErr);

  //           if (existing.length > 0 && existing[0].status === "Success") {
  //             // ✅ Already exists - don't insert again
  //             students.forEach((stu) => {
  //               if (
  //                 stu.roll_no === rollNo &&
  //                 String(stu.subject_id) === String(subjectId)
  //               ) {
  //                 stu.status = "Success";
  //               }
  //             });
  //             return callback(null, {
  //               students,
  //               totalCount,
  //               message: "Already marked as Success",
  //             });
  //           }

  //           // ✅ Otherwise insert new success record
  //           const insertQuery = `
  //           INSERT INTO omr_receipt (
  //             school_id,
  //             class_id,
  //             subject_id,
  //             roll_no,
  //             student_id,
  //             mobile_number,
  //             student_section,
  //             status,
  //             created_at
  //           )
  //           VALUES (?, ?, ?, ?, ?, ?, ?, 'Success', NOW())
  //         `;

  //           const insertParams = [
  //             schoolId,
  //             classId,
  //             subjectId,
  //             rollNo,
  //             student.student_id,
  //             student.mobile_number,
  //             student.student_section,
  //           ];

  //           db.query(insertQuery, insertParams, (insertErr) => {
  //             if (insertErr) {
  //               console.error("Error inserting OMR receipt:", insertErr);
  //               return callback(insertErr);
  //             }

  //             // ✅ Reflect immediate success in JSON output
  //             students.forEach((stu) => {
  //               if (
  //                 stu.roll_no === rollNo &&
  //                 String(stu.subject_id) === String(subjectId)
  //               ) {
  //                 stu.status = "Success";
  //               }
  //             });

  //             return callback(null, {
  //               students,
  //               totalCount,
  //               message: "Student marked as Success successfully",
  //             });
  //           });
  //         });
  //       } else {
  //         callback(null, { students, totalCount });
  //       }
  //     });
  //   });
  // },

  getStudents: (
    schoolId,
    classList,
    subjectList,
    rollnoclasssubject,
    callback,
  ) => {
    const placeholders = classList.map(() => "?").join(",");
    const subjectPlaceholders = subjectList.map(() => "?").join(",");

    const subjectJsonConditions = subjectList
      .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
      .join(" OR ");

    let dataQuery = `
    SELECT
      s.id AS student_id,
      s.roll_no,
      s.student_name,
      s.school_id,
      s.student_section,
      s.mobile_number,
      c.name AS class_name,
      sub.id AS subject_id,
      sub.name AS subject_names,
      COALESCE(o.status, 'Pending') AS status
    FROM student s
    LEFT JOIN class c ON s.class_id = c.id
    LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
      ON TRUE
    LEFT JOIN subject_master sub ON ss.subject_id = sub.id
    LEFT JOIN omr_receipt o
      ON o.school_id = s.school_id
      AND o.class_id = s.class_id
      AND o.subject_id = sub.id
      AND o.roll_no = s.roll_no
    WHERE s.school_id = ?
      AND s.class_id IN (${placeholders})
      AND (${subjectJsonConditions})
      AND sub.id IN (${subjectPlaceholders})
  `;

    let countQuery = `
    SELECT COUNT(*) as total_count
    FROM student s
    WHERE s.school_id = ?
      AND s.class_id IN (${placeholders})
      AND (${subjectJsonConditions})
  `;

    let dataParams = [
      schoolId,
      ...classList,
      ...subjectList.map((sub) => JSON.stringify(sub)),
      ...subjectList,
    ];

    let countParams = [
      schoolId,
      ...classList,
      ...subjectList.map((sub) => JSON.stringify(sub)),
    ];

    // ✅ Optional filter when rollno-class-subject provided
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
        subjectId,
      );
      countParams.push(rollNo, classId, JSON.stringify(Number(subjectId)));
    }

    db.query(dataQuery, dataParams, (err, students) => {
      if (err) return callback(err);

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) return callback(countErr);

        const totalCount = countResult[0].total_count;

        // ✅ Calculate counts (Success / Pending)
        const successCount = students.filter(
          (stu) => stu.status === "Success",
        ).length;
        const pendingCount = students.filter(
          (stu) => stu.status !== "Success",
        ).length;

        // ✅ When rollnoclasssubject provided, handle insert/update omr_receipt
        if (rollnoclasssubject && students.length > 0) {
          const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");
          const student = students[0];

          const checkQuery = `
          SELECT id, status 
          FROM omr_receipt
          WHERE school_id = ? 
            AND class_id = ? 
            AND subject_id = ? 
            AND roll_no = ?
        `;
          const checkParams = [schoolId, classId, subjectId, rollNo];

          db.query(checkQuery, checkParams, (checkErr, existing) => {
            if (checkErr) return callback(checkErr);

            if (existing.length > 0 && existing[0].status === "Success") {
              students.forEach((stu) => {
                if (
                  stu.roll_no === rollNo &&
                  String(stu.subject_id) === String(subjectId)
                ) {
                  stu.status = "Success";
                }
              });

              return callback(null, {
                students,
                totalCount,
                successCount,
                pendingCount,
                message: "Already marked as Success",
              });
            }

            const insertQuery = `
            INSERT INTO omr_receipt (
              school_id,
              class_id,
              subject_id,
              roll_no,
              student_id,
              mobile_number,
              student_section,
              status,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Success', NOW())
          `;

            const insertParams = [
              schoolId,
              classId,
              subjectId,
              rollNo,
              student.student_id,
              student.mobile_number,
              student.student_section,
            ];

            db.query(insertQuery, insertParams, (insertErr) => {
              if (insertErr) {
                console.error("Error inserting OMR receipt:", insertErr);
                return callback(insertErr);
              }

              // ✅ Reflect success immediately in response
              students.forEach((stu) => {
                if (
                  stu.roll_no === rollNo &&
                  String(stu.subject_id) === String(subjectId)
                ) {
                  stu.status = "Success";
                }
              });

              // ✅ Recalculate counts after marking success
              const newSuccessCount = students.filter(
                (stu) => stu.status === "Success",
              ).length;
              const newPendingCount = students.filter(
                (stu) => stu.status !== "Success",
              ).length;

              return callback(null, {
                students,
                totalCount,
                successCount: newSuccessCount,
                pendingCount: newPendingCount,
                message: "Student marked as Success successfully",
              });
            });
          });
        } else {
          // ✅ Return with counts (no insert case)
          callback(null, {
            students,
            totalCount,
            successCount,
            pendingCount,
          });
        }
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

  //asign--omr ok

  // getStudentsforassignomr: (schoolId, classList, subjectList, callback) => {
  //   const placeholders = classList.map(() => "?").join(",");
  //   const subjectPlaceholders = subjectList.map(() => "?").join(",");

  //   const subjectJsonConditions = subjectList
  //     .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
  //     .join(" OR ");

  //   // ✅ Main data query
  //   let dataQuery = `
  //   SELECT
  //     s.id AS student_id,
  //     s.roll_no,
  //     s.student_name,
  //     s.school_id,
  //     s.student_section,
  //     s.mobile_number,
  //     c.name AS class_name,
  //     sub.id AS subject_id,
  //     c.id AS class_id,
  //     sub.name AS subject_names,
  //     'Pending' AS status
  //   FROM student s
  //   LEFT JOIN class c ON s.class_id = c.id
  //   LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //     ON TRUE
  //   LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //   WHERE s.school_id = ?
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  //     AND sub.id IN (${subjectPlaceholders})
  // `;

  //   // ✅ Count total students
  //   let countQuery = `
  //   SELECT COUNT(*) as total_count
  //   FROM student s
  //   WHERE s.school_id = ?
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  // `;

  //   // ✅ Parameters
  //   let dataParams = [
  //     schoolId,
  //     ...classList,
  //     ...subjectList.map((sub) => JSON.stringify(sub)),
  //     ...subjectList,
  //   ];

  //   let countParams = [
  //     schoolId,
  //     ...classList,
  //     ...subjectList.map((sub) => JSON.stringify(sub)),
  //   ];

  //   // ✅ Execute main query
  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) return callback(err);

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) return callback(countErr);

  //       const totalCount = countResult[0].total_count;

  //       // ✅ All students start as Pending
  //       const successCount = 0;
  //       const pendingCount = totalCount;

  //       callback(null, {
  //         students,
  //         totalCount,
  //         successCount,
  //         pendingCount,
  //       });
  //     });
  //   });
  // },

  getStudentsforassignomr: (schoolId, classList, subjectList, callback) => {
    const placeholders = classList.map(() => "?").join(",");
    const subjectPlaceholders = subjectList.map(() => "?").join(",");

    const subjectJsonConditions = subjectList
      .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
      .join(" OR ");

    // ✅ MAIN QUERY: Includes LEFT JOIN TO CHECK OMR_ASSIGN
    let dataQuery = `
    SELECT
      s.id AS student_id,
      s.roll_no,
      s.student_name,
      s.school_id,
      s.student_section,
      s.mobile_number,
      c.name AS class_name,
      sub.id AS subject_id,
      c.id AS class_id,
      sub.name AS subject_names,

      /* 🟢 NEW: Check if record exists in omr_assign */
      CASE 
          WHEN oa.id IS NOT NULL THEN 1 
          ELSE 0 
      END AS exists_assign

    FROM student s
    LEFT JOIN class c ON s.class_id = c.id

    LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' 
      COLUMNS (subject_id INT PATH '$')
    ) AS ss ON TRUE

    LEFT JOIN subject_master sub ON ss.subject_id = sub.id

    /* 🟢 LEFT JOIN OMR_ASSIGN TABLE */
    LEFT JOIN omr_assign oa 
      ON oa.school_id = s.school_id
      AND oa.class_id = s.class_id
      AND oa.subject_id = sub.id
      AND oa.student_id = s.id

    WHERE s.school_id = ?
      AND s.class_id IN (${placeholders})
      AND (${subjectJsonConditions})
      AND sub.id IN (${subjectPlaceholders})
  `;

    // COUNT QUERY
    let countQuery = `
    SELECT COUNT(*) as total_count
    FROM student s
    WHERE s.school_id = ?
      AND s.class_id IN (${placeholders})
      AND (${subjectJsonConditions})
  `;

    let dataParams = [
      schoolId,
      ...classList,
      ...subjectList.map((sub) => JSON.stringify(sub)),
      ...subjectList,
    ];

    let countParams = [
      schoolId,
      ...classList,
      ...subjectList.map((sub) => JSON.stringify(sub)),
    ];

    db.query(dataQuery, dataParams, (err, students) => {
      if (err) return callback(err);

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) return callback(countErr);

        const totalCount = countResult[0].total_count;

        const successCount = students.filter(
          (x) => x.exists_assign === 1,
        ).length;
        const pendingCount = totalCount - successCount;

        callback(null, {
          students,
          totalCount,
          successCount,
          pendingCount,
        });
      });
    });
  },

  // ✅ Class name helper
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

  // ✅ Subject name helper
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
      JSON.stringify(sub),
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
    callback,
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
            },
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
