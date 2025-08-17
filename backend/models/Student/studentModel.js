import { db } from "../../config/db.js";

export const Student = {
  // create: (studentData, userId, callback) => {
  //   const {
  //     school_id,
  //     student_name,
  //     class_id,
  //     student_section,
  //     mobile_number,
  //     whatsapp_number,
  //     student_subject,
  //     approved,
  //     approved_by,
  //     country,
  //     state,
  //     district,
  //     city,
  //   } = studentData;

  //   // Step 1: Get school_code from school table using school_id
  //   const schoolQuery = `SELECT school_code FROM school WHERE id = ?`;

  //   db.query(schoolQuery, [school_id], (err, schoolResult) => {
  //     if (err) return callback(err);

  //     if (schoolResult.length === 0) {
  //       return callback(new Error("School not found"));
  //     }

  //     const school_code = schoolResult[0].school_code;

  //     // Step 2: Get the last roll_no for this school_code and class_name
  //     const rollQuery = `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`;
  //     const rollPrefix = `${school_code}${class_id}%`;

  //     db.query(rollQuery, [rollPrefix], (err, rollResult) => {
  //       if (err) return callback(err);

  //       let newRollNumber = 1;
  //       if (rollResult.length > 0) {
  //         const lastRoll = rollResult[0].roll_no;
  //         const lastRollNumber = parseInt(lastRoll.slice(-2), 10); // Extract last 2 digits
  //         newRollNumber = lastRollNumber + 1;
  //       }

  //       const formattedRollNo = `${school_code}${class_id}${String(
  //         newRollNumber
  //       ).padStart(2, "0")}`;

  //       // Step 3: Insert the new student record
  //       const insertQuery = `
  //       INSERT INTO student
  //       (school_id, student_name, roll_no, class_id, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, country, state, district, city, created_by, updated_by, created_at, updated_at)
  //       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  //     `;

  //       db.query(
  //         insertQuery,
  //         [
  //           school_id,
  //           student_name,
  //           formattedRollNo,
  //           class_id,
  //           student_section,
  //           mobile_number,
  //           whatsapp_number,
  //           JSON.stringify(student_subject || []) || null, // Convert JSON array to string
  //           approved,
  //           approved_by,
  //           country,
  //           state,
  //           district,
  //           city,
  //           userId, // Created by logged-in user
  //           userId, // Updated by logged-in user
  //         ],
  //         callback
  //       );
  //     });
  //   });
  // },

  // create: (studentData, userId, callback) => {
  //   const {
  //     school_id,
  //     student_name,
  //     class_id,
  //     student_section,
  //     mobile_number,
  //     whatsapp_number,
  //     student_subject,
  //     approved,
  //     approved_by,
  //     country,
  //     state,
  //     district,
  //     city,
  //   } = studentData;

  //   // ✅ Step 0: Get the latest active session ID
  //   const sessionQuery = `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`;
  //   db.query(sessionQuery, (err, sessionResult) => {
  //     if (err) return callback(err);

  //     if (sessionResult.length === 0) {
  //       return callback(new Error("No active session found"));
  //     }

  //     const session_id = sessionResult[0].id;

  //     // ✅ Step 1: Get school_code from school table using school_id
  //     const schoolQuery = `SELECT school_code FROM school WHERE id = ?`;

  //     db.query(schoolQuery, [school_id], (err, schoolResult) => {
  //       if (err) return callback(err);

  //       if (schoolResult.length === 0) {
  //         return callback(new Error("School not found"));
  //       }

  //       const school_code = schoolResult[0].school_code;

  //       // ✅ Step 2: Get the last roll_no for this school_code and class_name
  //       const rollQuery = `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`;
  //       const rollPrefix = `${school_code}${class_id}%`;

  //       db.query(rollQuery, [rollPrefix], (err, rollResult) => {
  //         if (err) return callback(err);

  //         let newRollNumber = 1;
  //         if (rollResult.length > 0) {
  //           const lastRoll = rollResult[0].roll_no;
  //           const lastRollNumber = parseInt(lastRoll.slice(-2), 10); // Extract last 2 digits
  //           newRollNumber = lastRollNumber + 1;
  //         }

  //         const formattedRollNo = `${school_code}${class_id}${String(
  //           newRollNumber
  //         ).padStart(2, "0")}`;

  //         // ✅ Step 3: Insert the new student record
  //         const insertQuery = `
  //         INSERT INTO student
  //         (school_id, student_name, roll_no, class_id, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, country, state, district, city, session_id, created_by, updated_by, created_at, updated_at)
  //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  //       `;

  //         db.query(
  //           insertQuery,
  //           [
  //             school_id,
  //             student_name,
  //             formattedRollNo,
  //             class_id,
  //             student_section,
  //             mobile_number,
  //             whatsapp_number,
  //             JSON.stringify(student_subject || []) || null,
  //             approved,
  //             approved_by,
  //             country,
  //             state,
  //             district,
  //             city,
  //             session_id, // ✅ Insert the auto-generated session_id
  //             userId,
  //             userId,
  //           ],
  //           callback
  //         );
  //       });
  //     });
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
      student_subject,
      approved,
      approved_by,
      country,
      state,
      district,
      city,
      level = 1, // ✅ Default level
      level_status = "continue", // ✅ Default status
    } = studentData;

    const sessionQuery = `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`;
    db.query(sessionQuery, (err, sessionResult) => {
      if (err) return callback(err);

      if (sessionResult.length === 0) {
        return callback(new Error("No active session found"));
      }

      const session_id = sessionResult[0].id;

      const schoolQuery = `SELECT school_code FROM school WHERE id = ?`;
      db.query(schoolQuery, [school_id], (err, schoolResult) => {
        if (err) return callback(err);
        if (schoolResult.length === 0) {
          return callback(new Error("School not found"));
        }

        const school_code = schoolResult[0].school_code;
        const rollPrefix = `${school_code}${class_id}${level}%`;

        const rollQuery = `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`;
        db.query(rollQuery, [rollPrefix], (err, rollResult) => {
          if (err) return callback(err);

          let newRollNumber = 1;
          if (rollResult.length > 0) {
            const lastRoll = rollResult[0].roll_no;
            const lastRollNumber = parseInt(lastRoll.slice(-2), 10);
            newRollNumber = lastRollNumber + 1;
          }

          const formattedRollNo = `${school_code}${class_id}${level}${String(
            newRollNumber
          ).padStart(2, "0")}`;

          const insertQuery = `
          INSERT INTO student 
          (school_id, student_name, roll_no, class_id, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, country, state, district, city, session_id, created_by, updated_by, created_at, updated_at, level, level_status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
        `;

          db.query(
            insertQuery,
            [
              school_id,
              student_name,
              formattedRollNo,
              class_id,
              student_section,
              mobile_number,
              whatsapp_number,
              JSON.stringify(student_subject || []) || null,
              approved,
              approved_by,
              country,
              state,
              district,
              city,
              session_id,
              userId,
              userId,
              level,
              level_status,
            ],
            callback
          );
        });
      });
    });
  },

  // BULK UPLOAD
  // bulkCreate: (students, userId) => {
  //   return new Promise((resolve, reject) => {
  //     const requiredFields = [
  //       "school_id",
  //       "class_id",
  //       "student_section",
  //       "student_name",
  //     ];

  //     // Check for missing required fields
  //     const missingFields = students.reduce((acc, student, index) => {
  //       const missing = requiredFields.filter(
  //         (field) => student[field] == null || student[field] === ""
  //       );
  //       if (missing.length > 0) {
  //         acc.push(
  //           `Student at index ${index} missing required fields: ${missing.join(
  //             ", "
  //           )}`
  //         );
  //       }
  //       return acc;
  //     }, []);

  //     if (missingFields.length > 0) {
  //       return reject(
  //         new Error("Missing required fields", { cause: missingFields })
  //       );
  //     }

  //     // Normalize and validate static fields
  //     const validateFields = [
  //       "school_id",
  //       "country",
  //       "state",
  //       "district",
  //       "city",
  //     ];
  //     const inconsistencies = {};

  //     for (const field of validateFields) {
  //       const values = [
  //         ...new Set(
  //           students.map((s) => (s[field] ?? "").trim().toUpperCase())
  //         ),
  //       ];
  //       if (values.length > 1) {
  //         inconsistencies[
  //           field
  //         ] = `The Students ${field} not match: ${values.join(", ")}`;
  //       }
  //     }

  //     // Normalize and validate class_name (allow multiple classes, but ensure they exist)
  //     const classNames = [
  //       ...new Set(
  //         students.map((s) => (s.class_id ?? "").trim().toUpperCase())
  //       ),
  //     ];
  //     if (classNames.length > 1) {
  //       // Log multiple class names but don't reject unless invalid
  //       console.warn(`Multiple class names detected: ${classNames.join(", ")}`);
  //     }

  //     // Handle student_subject (convert space-separated strings to arrays if needed)
  //     const normalizedStudents = students.map((student) => {
  //       let subjects = student.student_subject;
  //       if (typeof subjects === "string") {
  //         subjects = subjects
  //           .trim()
  //           .split(/\s+/)
  //           .filter((sub) => sub !== "");
  //       }
  //       return {
  //         ...student,
  //         student_subject: Array.isArray(subjects)
  //           ? subjects.map((sub) => sub.trim().toUpperCase()).sort()
  //           : [],
  //       };
  //     });

  //     // Validate student_subject (ensure they exist in subject_master, but allow different subjects)
  //     const allSubjects = [
  //       ...new Set(normalizedStudents.flatMap((s) => s.student_subject)),
  //     ];
  //     if (allSubjects.length > 1) {
  //       console.warn(
  //         `Multiple subject sets detected: ${JSON.stringify(allSubjects)}`
  //       );
  //     }

  //     if (Object.keys(inconsistencies).length > 1) {
  //       // Only reject if fields other than class_name or student_subject are inconsistent
  //       return reject(
  //         new Error("Inconsistent student data", { cause: inconsistencies })
  //       );
  //     }

  //     // Grouping by school_name and class_name
  //     const groupedStudents = normalizedStudents.reduce((acc, student) => {
  //       const key = `${student.school_name}-${student.class_name}`;
  //       acc[key] = acc[key] || [];
  //       acc[key].push(student);
  //       return acc;
  //     }, {});

  //     // Lookup helpers
  //     const getIdByName = (table, name) => {
  //       return new Promise((resolve, reject) => {
  //         if (
  //           ![
  //             "countries",
  //             "states",
  //             "districts",
  //             "cities",
  //             "class",
  //             "subject_master",
  //           ].includes(table)
  //         ) {
  //           return reject(new Error(`Invalid table: ${table}`));
  //         }
  //         db.query(
  //           `SELECT id FROM ${table} WHERE name = ?`,
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

  //     const getSubjectIds = async (subjects) => {
  //       return Promise.all(
  //         subjects.map((sub) => getIdByName("subject_master", sub.trim()))
  //       );
  //     };

  //     // Group processor
  //     const processGroup = async (group, schoolName, className) => {
  //       const schoolResult = await new Promise((resolve, reject) =>
  //         db.query(
  //           `SELECT school_code FROM school WHERE id = ?`,
  //           [schoolName],
  //           (err, result) => (err ? reject(err) : resolve(result))
  //         )
  //       );

  //       if (schoolResult.length === 0)
  //         throw new Error(`School not found: ${schoolName}`);
  //       const { school_code } = schoolResult[0];

  //       const rollResult = await new Promise((resolve, reject) =>
  //         db.query(
  //           `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1 FOR UPDATE`,
  //           [`${school_code}${className}%`],
  //           (err, result) => (err ? reject(err) : resolve(result))
  //         )
  //       );

  //       let newRollNumber =
  //         rollResult.length > 0
  //           ? parseInt(rollResult[0].roll_no.slice(-2), 10) + 1
  //           : 1;

  //       const studentsWithIds = [];
  //       for (const student of group) {
  //         const [countryId, stateId, districtId, cityId, classId, subjectIds] =
  //           await Promise.all([
  //             getIdByName("countries", student.country),
  //             getIdByName("states", student.state),
  //             getIdByName("districts", student.district),
  //             getIdByName("cities", student.city),
  //             getIdByName("class", student.class_name),
  //             getSubjectIds(student.student_subject),
  //           ]);

  //         const formattedRollNo = `${school_code}${className}${String(
  //           newRollNumber
  //         ).padStart(2, "0")}`;
  //         if (formattedRollNo.length > 20) {
  //           throw new Error(`Roll number too long: ${formattedRollNo}`);
  //         }

  //         newRollNumber++;

  //         studentsWithIds.push({
  //           ...student,
  //           school_id: schoolResult[0].school_name,
  //           roll_no: formattedRollNo,
  //           country: countryId,
  //           state: stateId,
  //           district: districtId,
  //           city: cityId,
  //           class_id: classId,
  //           student_subject: subjectIds,
  //           updated: 0,
  //         });
  //       }

  //       return studentsWithIds;
  //     };

  //     // Process all groups
  //     const processAllGroups = async () => {
  //       const errors = [];
  //       const allStudents = [];

  //       const results = await Promise.all(
  //         Object.entries(groupedStudents).map(async ([key, group]) => {
  //           try {
  //             const [schoolName, className] = key.split("-");
  //             const processed = await processGroup(
  //               group,
  //               schoolName,
  //               className
  //             );
  //             return { students: processed };
  //           } catch (err) {
  //             return { error: { group: key, message: err.message } };
  //           }
  //         })
  //       );

  //       for (const { students, error } of results) {
  //         if (error) errors.push(error);
  //         else allStudents.push(...students);
  //       }

  //       if (allStudents.length === 0 && errors.length > 0) {
  //         throw new Error("No valid students to insert", { cause: errors });
  //       }

  //       return { allStudents, errors };
  //     };

  //     // Main logic
  //     processAllGroups()
  //       .then(({ allStudents, errors }) => {
  //         if (allStudents.length === 0) {
  //           return reject(
  //             new Error("No valid students to insert", { cause: errors })
  //           );
  //         }

  //         const query = `
  //         INSERT INTO student
  //         (school_id, student_name, roll_no, class_id, student_section, mobile_number, whatsapp_number, student_subject,
  //         country, state, district, city, approved, approved_by, created_by, updated_by, created_at, updated_at)
  //         VALUES ?
  //       `;

  //         const values = allStudents.map((student) => [
  //           student.school_id,
  //           student.student_name,
  //           student.roll_no,
  //           student.class_id,
  //           student.student_section ?? null,
  //           student.mobile_number ?? null,
  //           student.whatsapp_number ?? null,
  //           JSON.stringify(student.student_subject),
  //           student.country,
  //           student.state,
  //           student.district,
  //           student.city,
  //           student.approved ?? 0,
  //           student.approved_by ?? null,
  //           userId,
  //           userId,
  //           new Date(),
  //           new Date(),
  //         ]);

  //         db.beginTransaction((err) => {
  //           if (err) return reject(err);
  //           db.query(query, [values], (err, result) => {
  //             if (err) return db.rollback(() => reject(err));
  //             db.commit((err) => {
  //               if (err) return db.rollback(() => reject(err));
  //               resolve({
  //                 ...result,
  //                 errors: errors.length ? errors : undefined,
  //               });
  //             });
  //           });
  //         });
  //       })
  //       .catch((err) =>
  //         reject(
  //           err.cause
  //             ? err
  //             : new Error("Processing failed", { cause: [err.message] })
  //         )
  //       );
  //   });
  // },

  // bulkCreate: (students, userId) => {
  //   return new Promise((resolve, reject) => {
  //     const requiredFields = [
  //       "school_id",
  //       "class_id",
  //       "student_name",
  //       "student_section",
  //     ];
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

  //     const getSubjectIds = async (subjects) => {
  //       return Promise.all(
  //         subjects.map((s) => getIdByName("subject_master", s))
  //       );
  //     };

  //     const normalizeStudent = async (student) => {
  //       const [schoolId, classId, countryId, stateId, districtId, cityId] =
  //         await Promise.all([
  //           getIdByName("school", student.school_id),
  //           getIdByName("class", student.class_id),
  //           getIdByName("countries", student.country),
  //           getIdByName("states", student.state),
  //           getIdByName("districts", student.district),
  //           getIdByName("cities", student.city),
  //         ]);

  //       let subjects = student.student_subject;
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
  //         student_subject: subjectIds,
  //       };
  //     };

  //     const processStudents = async () => {
  //       const normalized = [];
  //       const errors = [];

  //       for (const student of students) {
  //         try {
  //           const normalizedStudent = await normalizeStudent(student);
  //           normalized.push(normalizedStudent);
  //         } catch (err) {
  //           errors.push({ student: student.student_name, error: err.message });
  //         }
  //       }

  //       if (normalized.length === 0) {
  //         throw new Error("All student records failed validation", {
  //           cause: errors,
  //         });
  //       }

  //       // Group by school_id and class_id
  //       const grouped = normalized.reduce((acc, student) => {
  //         const key = `${student.school_id}-${student.class_id}`;
  //         acc[key] = acc[key] || [];
  //         acc[key].push(student);
  //         return acc;
  //       }, {});

  //       return { grouped, errors };
  //     };

  //     const assignRollNumbers = async (group, school_id, class_id) => {
  //       const rollPrefix = await new Promise((resolve, reject) =>
  //         db.query(
  //           `SELECT school_code FROM school WHERE id = ?`,
  //           [school_id],
  //           (err, result) => {
  //             if (err) return reject(err);
  //             if (result.length === 0)
  //               return reject(new Error("School code not found"));
  //             resolve(result[0].school_code + class_id);
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

  //       return group.map((student) => {
  //         const rollNo = `${rollPrefix}${String(rollNum++).padStart(2, "0")}`;
  //         return { ...student, roll_no: rollNo };
  //       });
  //     };

  //     const insertStudents = (studentsToInsert) => {
  //       const query = `
  //       INSERT INTO student
  //       (school_id, student_name, roll_no, class_id, student_section, mobile_number, whatsapp_number, student_subject,
  //       country, state, district, city, approved, approved_by, created_by, updated_by, created_at, updated_at)
  //       VALUES ?`;

  //       const values = studentsToInsert.map((s) => [
  //         s.school_id,
  //         s.student_name,
  //         s.roll_no,
  //         s.class_id,
  //         s.student_section,
  //         s.mobile_number ?? null,
  //         s.whatsapp_number ?? null,
  //         JSON.stringify(s.student_subject),
  //         s.country,
  //         s.state,
  //         s.district,
  //         s.city,
  //         s.approved ?? 0,
  //         s.approved_by ?? null,
  //         userId,
  //         userId,
  //         new Date(),
  //         new Date(),
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

  //     // Main execution
  //     processStudents()
  //       .then(async ({ grouped, errors }) => {
  //         const allToInsert = [];

  //         for (const key of Object.keys(grouped)) {
  //           const [school_id, class_id] = key.split("-").map(Number);
  //           const group = grouped[key];
  //           const withRoll = await assignRollNumbers(
  //             group,
  //             school_id,
  //             class_id
  //           );
  //           allToInsert.push(...withRoll);
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
  //       .catch((err) =>
  //         reject(
  //           err.cause
  //             ? err
  //             : new Error("Student processing failed", { cause: [err.message] })
  //         )
  //       );
  //   });
  // },

  bulkCreate: (students, userId) => {
    return new Promise((resolve, reject) => {
      const requiredFields = [
        "school_id",
        "class_id",
        "student_name",
        "student_section",
      ];

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

      const getSession = () => {
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
          getSession(),
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
          level_status: student.level_status || "continue",
        };
      };

      const processStudents = async () => {
        const normalized = [];
        const errors = [];

        for (const student of students) {
          try {
            const normalizedStudent = await normalizeStudent(student);
            normalized.push(normalizedStudent);
          } catch (err) {
            errors.push({ student: student.student_name, error: err.message });
          }
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

        return { grouped, errors };
      };

      const assignRollNumbers = async (group, school_id, class_id, level) => {
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

        return group.map((student) => {
          const rollNo = `${rollPrefix}${String(rollNum++).padStart(2, "0")}`;
          return { ...student, roll_no: rollNo };
        });
      };

      const insertStudents = (studentsToInsert) => {
        const query = `
        INSERT INTO student
        (school_id, student_name, roll_no, class_id, student_section, mobile_number, whatsapp_number, student_subject,
         country, state, district, city, session_id, approved, approved_by, created_by, updated_by, created_at, updated_at, level, level_status)
        VALUES ?`;

        const values = studentsToInsert.map((s) => [
          s.school_id,
          s.student_name,
          s.roll_no,
          s.class_id,
          s.student_section,
          s.mobile_number ?? null,
          s.whatsapp_number ?? null,
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
          s.level_status,
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

      processStudents()
        .then(async ({ grouped, errors }) => {
          const allToInsert = [];

          for (const key of Object.keys(grouped)) {
            const [school_id, class_id, level] = key.split("-").map(Number);
            const group = grouped[key];
            const withRoll = await assignRollNumbers(
              group,
              school_id,
              class_id,
              level
            );
            allToInsert.push(...withRoll);
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
        .catch((err) =>
          reject(
            err.cause
              ? err
              : new Error("Student processing failed", { cause: [err.message] })
          )
        );
    });
  },

  getAllStudent: (callback) => {
    const query = "SELECT * FROM student";
    db.query(query, callback);
  },

  //pagination and serch and get all data
  // getAll: (page = 1, limit = 10, search = "", callback) => {
  //   const offset = (page - 1) * limit;
  //   let whereClause = "";
  //   let queryParams = [];

  //   if (search && search.trim() !== "") {
  //     whereClause = `WHERE
  //     student_name LIKE ? OR
  //     roll_no LIKE ?`;

  //     for (let i = 0; i < 2; i++) queryParams.push(`%${search}%`);
  //   }

  //   const query = `
  //   SELECT * FROM student
  //   ${whereClause}
  //   ORDER BY id DESC
  //   LIMIT ? OFFSET ?;
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) AS total FROM student
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

  getAll: (page = 1, limit = 10, search = "", callback) => {
    const offset = (page - 1) * limit;
    let whereClause = "";
    let queryParams = [];

    if (search && search.trim() !== "") {
      whereClause = `WHERE 
      s.student_name LIKE ? OR 
      s.roll_no LIKE ? OR 
      sc.school_name LIKE ?`;

      for (let i = 0; i < 3; i++) queryParams.push(`%${search}%`);
    }

    const query = `
    SELECT 
      s.*, 
      sc.school_name 
    FROM student s
    JOIN school sc ON s.school_id = sc.id
    ${whereClause}
    ORDER BY s.id DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total 
    FROM student s
    JOIN school sc ON s.school_id = sc.id
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
            mobile_number = ?, whatsapp_number = ?, student_subject = ?, 
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

  //   // For checking if JSON array contains any subject ID
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
  //     GROUP_CONCAT(DISTINCT sub.name) AS subject_names
  //   FROM student s
  //   LEFT JOIN class c ON s.class_id = c.id
  //   LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
  //     ON TRUE
  //   LEFT JOIN subject_master sub ON ss.subject_id = sub.id
  //   WHERE s.school_id = (SELECT id FROM school WHERE school_name = ? LIMIT 1)
  //     AND s.class_id IN (${placeholders})
  //     AND (${subjectJsonConditions})
  //     AND sub.id IN (${subjectPlaceholders})
  //   GROUP BY s.id
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

  //   const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
  //   const dataParams = [
  //     schoolName,
  //     ...classList,
  //     ...jsonSubjectParams,
  //     ...subjectList,
  //   ];
  //   const countParams = [schoolName, ...classList, ...jsonSubjectParams];

  //   db.query(dataQuery, dataParams, (err, students) => {
  //     if (err) {
  //       return callback(err);
  //     }

  //     db.query(countQuery, countParams, (countErr, countResult) => {
  //       if (countErr) {
  //         return callback(countErr);
  //       }

  //       const totalCount = countResult[0].total_count || 0;
  //       callback(null, { students, totalCount });
  //     });
  //   });
  // },

  // getClassNames: (classIds, callback) => {
  //   if (!classIds.length) return callback(null, []);
  //   const placeholders = classIds.map(() => "?").join(",");
  //   const query = `
  //   SELECT id, name AS class_name
  //   FROM class
  //   WHERE id IN (${placeholders})
  // `;
  //   db.query(query, classIds, callback);
  // },

  // getSubjectNames: (subjectIds, callback) => {
  //   if (!subjectIds.length) return callback(null, []);
  //   const placeholders = subjectIds.map(() => "?").join(",");
  //   const query = `
  //   SELECT id, name AS subject_name
  //   FROM subject_master
  //   WHERE id IN (${placeholders})
  // `;
  //   db.query(query, subjectIds, callback);
  // },

  getStudentsByFilters: (schoolName, classList, subjectList, callback) => {
    if (!classList.length || !subjectList.length) {
      return callback(null, { students: [], totalCount: 0 });
    }

    const placeholders = classList.map(() => "?").join(",");
    const subjectPlaceholders = subjectList.map(() => "?").join(",");

    const subjectJsonConditions = subjectList
      .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
      .join(" OR ");

    const dataQuery = `
      SELECT 
        s.id,
        s.roll_no,
        s.student_name,
        s.school_id,
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
    `;

    const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
    const dataParams = [
      schoolName,
      ...classList,
      ...jsonSubjectParams,
      ...subjectList,
    ];
    const countParams = [schoolName, ...classList, ...jsonSubjectParams];

    db.query(dataQuery, dataParams, (err, students) => {
      if (err) return callback(err);

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) return callback(countErr);

        const totalCount = countResult[0].total_count || 0;
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
  getStudentforAttendance: (schoolId, classList, subjectList, callback) => {
    if (!classList.length || !subjectList.length) {
      return callback(null, { students: [], totalCount: 0 });
    }

    const classPlaceholders = classList.map(() => "?").join(",");
    const subjectJsonConditions = subjectList
      .map(() => `JSON_CONTAINS(s.student_subject, ?)`)
      .join(" OR ");

    const dataQuery = `
    SELECT
      s.id,
      s.roll_no,
      s.student_name,
      s.school_id,
      c.name AS class_name,
      GROUP_CONCAT(DISTINCT sub.name) AS subject_names
    FROM student s
    LEFT JOIN class c ON s.class_id = c.id
    LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
      ON TRUE
    LEFT JOIN subject_master sub ON ss.subject_id = sub.id
    WHERE s.school_id = ?
      AND s.class_id IN (${classPlaceholders})
      AND (${subjectJsonConditions})
    GROUP BY s.id
  `;

    const countQuery = `
    SELECT COUNT(DISTINCT s.id) AS total_count
    FROM student s
    WHERE s.school_id = ?
      AND s.class_id IN (${classPlaceholders})
      AND (${subjectJsonConditions})
  `;

    const jsonSubjectParams = subjectList.map((sub) => JSON.stringify(sub));
    const dataParams = [schoolId, ...classList, ...jsonSubjectParams];
    const countParams = [schoolId, ...classList, ...jsonSubjectParams];

    db.query(dataQuery, dataParams, (err, students) => {
      if (err) {
        return callback(err);
      }

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) {
          return callback(countErr);
        }

        const totalCount = countResult[0]?.total_count || 0;
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
};

export default Student;
