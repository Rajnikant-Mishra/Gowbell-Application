import { db } from "../../config/db.js";

export const Student = {
  create: (studentData, userId, callback) => {
    const {
      school_name,
      student_name,
      class_name,
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

    // Step 1: Get school_code from school table
    const schoolQuery = `SELECT school_code FROM school WHERE school_name = ?`;

    db.query(schoolQuery, [school_name], (err, schoolResult) => {
      if (err) return callback(err);

      if (schoolResult.length === 0) {
        return callback(new Error("School not found"));
      }

      const school_code = schoolResult[0].school_code;

      // Step 2: Get the last roll_no for this school_code and class_name
      const rollQuery = `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`;
      const rollPrefix = `${school_code}${class_name}%`;

      db.query(rollQuery, [rollPrefix], (err, rollResult) => {
        if (err) return callback(err);

        let newRollNumber = 1;
        if (rollResult.length > 0) {
          const lastRoll = rollResult[0].roll_no;
          const lastRollNumber = parseInt(lastRoll.slice(-2), 10); // Extract last 2 digits
          newRollNumber = lastRollNumber + 1;
        }

        const formattedRollNo = `${school_code}${class_name}${String(
          newRollNumber
        ).padStart(2, "0")}`;

        // Step 3: Insert the new student record
        const insertQuery = `
          INSERT INTO student 
          (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, country, state, district, city, created_by, updated_by, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        db.query(
          insertQuery,
          [
            school_name,
            student_name,
            formattedRollNo,
            class_name,
            student_section,
            mobile_number,
            whatsapp_number,
            JSON.stringify(student_subject || []) || null, // Convert JSON array to string
            approved,
            approved_by,
            country,
            state,
            district,
            city,
            userId, // Created by logged-in user
            userId, // Updated by logged-in user
          ],
          callback
        );
      });
    });
  },

  // BULK UPLOAD
  // bulkCreate: (students, userId, callback) => {
  //   // Step 1: Group students by school_name and class_name
  //   const groupedStudents = students.reduce((acc, student) => {
  //     const key = `${student.school_name}-${student.class_name}`;
  //     if (!acc[key]) {
  //       acc[key] = [];
  //     }
  //     acc[key].push(student);
  //     return acc;
  //   }, {});

  //   // Step 2: Process each group to generate roll_no
  //   const processGroup = (group, schoolName, className, callback) => {
  //     // Get school_code from school table
  //     const schoolQuery = `SELECT school_code FROM school WHERE school_name = ?`;

  //     db.query(schoolQuery, [schoolName], (err, schoolResult) => {
  //       if (err) return callback(err);

  //       if (schoolResult.length === 0) {
  //         return callback(new Error(`School not found: ${schoolName}`));
  //       }

  //       const school_code = schoolResult[0].school_code;

  //       // Get the last roll_no for this school_code and class_name
  //       const rollQuery = `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`;
  //       const rollPrefix = `${school_code}${className}%`;

  //       db.query(rollQuery, [rollPrefix], (err, rollResult) => {
  //         if (err) return callback(err);

  //         let newRollNumber = 1;
  //         if (rollResult.length > 0) {
  //           const lastRoll = rollResult[0].roll_no;
  //           const lastRollNumber = parseInt(lastRoll.slice(-2), 10); // Extract last 2 digits
  //           newRollNumber = lastRollNumber + 1;
  //         }

  //         // Generate roll_no for each student in the group
  //         const studentsWithRollNo = group.map((student, index) => {
  //           const formattedRollNo = `${school_code}${className}${String(
  //             newRollNumber + index
  //           ).padStart(2, "0")}`;
  //           return {
  //             ...student,
  //             roll_no: formattedRollNo,
  //           };
  //         });

  //         callback(null, studentsWithRollNo);
  //       });
  //     });
  //   };

  //   // Step 3: Process all groups and collect results
  //   const processAllGroups = async () => {
  //     const allStudents = [];
  //     for (const key of Object.keys(groupedStudents)) {
  //       const [schoolName, className] = key.split("-");
  //       const group = groupedStudents[key];
  //       await new Promise((resolve, reject) => {
  //         processGroup(
  //           group,
  //           schoolName,
  //           className,
  //           (err, studentsWithRollNo) => {
  //             if (err) return reject(err);
  //             allStudents.push(...studentsWithRollNo);
  //             resolve();
  //           }
  //         );
  //       });
  //     }
  //     return allStudents;
  //   };

  //   // Step 4: Insert all students with generated roll_no
  //   processAllGroups()
  //     .then((allStudents) => {
  //       const query = `
  //         INSERT INTO student
  //         (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, country, state, district, city, approved, approved_by, created_by, updated_by, created_at, updated_at)
  //         VALUES ?
  //       `;

  //       // Convert student objects to an array of arrays for bulk insertion
  //       const values = allStudents.map((student) => [
  //         student.school_name,
  //         student.student_name,
  //         student.roll_no,
  //         student.class_name,
  //         student.student_section,
  //         student.mobile_number,
  //         student.whatsapp_number,
  //         JSON.stringify(student.student_subject || []) || null, // Convert JSON array to string
  //         student.country,
  //         student.state,
  //         student.district,
  //         student.city,
  //         student.approved,
  //         student.approved_by,
  //         userId, // Created by logged-in user
  //         userId, // Updated by logged-in user
  //         new Date(), // created_at
  //         new Date(), // updated_at
  //       ]);

  //       // Execute the query with the array of values
  //       db.query(query, [values], callback);
  //     })
  //     .catch(callback);
  // },

  // bulkCreate: (students, userId) => {
  //   return new Promise((resolve, reject) => {
  //     // Group students by school_name and class_name
  //     const groupedStudents = students.reduce((acc, student) => {
  //       const key = `${student.school_name}-${student.class_name}`;
  //       acc[key] = acc[key] || [];
  //       acc[key].push(student);
  //       return acc;
  //     }, {});

  //     const getIdByName = (table, name) => {
  //       const validTables = [
  //         "countries",
  //         "states",
  //         "districts",
  //         "cities",
  //         "class",
  //         "subject_master",
  //       ];
  //       if (!validTables.includes(table)) {
  //         throw new Error(`Invalid table: ${table}`);
  //       }
  //       return new Promise((resolve, reject) => {
  //         db.query(
  //           `SELECT id FROM ${table} WHERE name = ?`,
  //           [name],
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
  //       if (!Array.isArray(subjects) || subjects.length === 0) return [];
  //       return Promise.all(
  //         subjects.map((subject) => getIdByName("subject_master", subject))
  //       );
  //     };

  //     const processGroup = async (group, schoolName, className) => {
  //       const schoolResult = await new Promise((resolve, reject) =>
  //         db.query(
  //           `SELECT school_code FROM school WHERE school_name = ?`,
  //           [schoolName],
  //           (err, result) => (err ? reject(err) : resolve(result))
  //         )
  //       );
  //       if (schoolResult.length === 0) {
  //         throw new Error(`School not found: ${schoolName}`);
  //       }
  //       const school_code = schoolResult[0].school_code;

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

  //       const studentsWithRollNoAndIds = [];
  //       for (const student of group) {
  //         const requiredFields = ["student_name", "school_name", "class_name"];
  //         const missing = requiredFields.filter((field) => !student[field]);
  //         if (missing.length) {
  //           throw new Error(
  //             `Missing fields for student: ${missing.join(", ")}`
  //           );
  //         }
  //         if (!Array.isArray(student.student_subject)) {
  //           throw new Error(
  //             `Invalid student_subject for ${student.student_name}`
  //           );
  //         }

  //         const [countryId, stateId, districtId, cityId, classId, subjectIds] =
  //           await Promise.all([
  //             getIdByName("countries", student.country),
  //             getIdByName("states", student.state),
  //             getIdByName("districts", student.district),
  //             getIdByName("cities", student.city),
  //             getIdByName("class", className),
  //             getSubjectIds(student.student_subject),
  //           ]);

  //         const formattedRollNo = `${school_code}${className}${String(
  //           newRollNumber
  //         ).padStart(2, "0")}`;
  //         if (formattedRollNo.length > 20) {
  //           throw new Error(`Roll number too long: ${formattedRollNo}`);
  //         }
  //         newRollNumber++;

  //         studentsWithRollNoAndIds.push({
  //           ...student,
  //           roll_no: formattedRollNo,
  //           country: countryId,
  //           state: stateId,
  //           district: districtId,
  //           city: cityId,
  //           class_name: classId,
  //           student_subject: subjectIds,
  //         });
  //       }
  //       return studentsWithRollNoAndIds;
  //     };

  //     const processAllGroups = async () => {
  //       const errors = [];
  //       const allStudents = [];
  //       const groupPromises = Object.keys(groupedStudents).map(async (key) => {
  //         try {
  //           const [schoolName, className] = key.split("-");
  //           const students = await processGroup(
  //             groupedStudents[key],
  //             schoolName,
  //             className
  //           );
  //           return { students };
  //         } catch (err) {
  //           return { error: { group: key, message: err.message } };
  //         }
  //       });

  //       const results = await Promise.all(groupPromises);
  //       results.forEach(({ students, error }) => {
  //         if (error) {
  //           errors.push(error);
  //         } else {
  //           allStudents.push(...students);
  //         }
  //       });

  //       if (allStudents.length === 0 && errors.length > 0) {
  //         throw new Error("No valid students to insert", { cause: errors });
  //       }
  //       return { allStudents, errors };
  //     };

  //     processAllGroups()
  //       .then(({ allStudents, errors }) => {
  //         if (allStudents.length === 0) {
  //           return reject(
  //             new Error("No valid students to insert", { cause: errors })
  //           );
  //         }

  //         const query = `
  //         INSERT INTO student 
  //         (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, 
  //          country, state, district, city, approved, approved_by, created_by, updated_by, created_at, updated_at) 
  //         VALUES ?
  //       `;
  //         const values = allStudents.map((student) => [
  //           student.school_name,
  //           student.student_name,
  //           student.roll_no,
  //           student.class_name,
  //           student.student_section ?? null,
  //           student.mobile_number ?? null,
  //           student.whatsapp_number ?? null,
  //           JSON.stringify(student.student_subject || []),
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
  //             if (err) {
  //               db.rollback(() => reject(err));
  //               return;
  //             }
  //             db.commit((err) => {
  //               if (err) {
  //                 db.rollback(() => reject(err));
  //                 return;
  //               }
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

  bulkCreate: (students, userId) => {
  return new Promise((resolve, reject) => {
    // Validate that all students have the same school_name, class_name, country, state, district, city
    const validateFields = [
      "school_name",
      "class_name",
      "country",
      "state",
      "district",
      "city",
    ];
    const inconsistencies = validateFields.reduce((acc, field) => {
      const values = [...new Set(students.map((s) => s[field]))];
      if (values.length > 1) {
        acc[field] = `The Students  ${field} not match : ${values.join(", ")}`;
      }
      return acc;
    }, {});

    // Validate that all students have the same student_subject
    const subjects = students.map((s) => JSON.stringify(s.student_subject?.sort() || []));
    const uniqueSubjects = [...new Set(subjects)];
    if (uniqueSubjects.length > 1) {
      inconsistencies.student_subject =
        `The student subjects not match : ${uniqueSubjects.join(", ")}`;
    }

    if (Object.keys(inconsistencies).length > 0) {
      return reject(new Error("Inconsistent student data", { cause: inconsistencies }));
    }

    // Group students by school_name and class_name (though already validated as same)
    const groupedStudents = students.reduce((acc, student) => {
      const key = `${student.school_name}-${student.class_name}`;
      acc[key] = acc[key] || [];
      acc[key].push(student);
      return acc;
    }, {});

    const getIdByName = (table, name) => {
      const validTables = [
        "countries",
        "states",
        "districts",
        "cities",
        "class",
        "subject_master",
      ];
      if (!validTables.includes(table)) {
        throw new Error(`Invalid table: ${table}`);
      }
      return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM ${table} WHERE name = ?`, [name], (err, result) => {
          if (err) return reject(err);
          if (result.length === 0) return reject(new Error(`${table} not found: ${name}`));
          resolve(result[0].id);
        });
      });
    };

    const getSubjectIds = async (subjects) => {
      if (!Array.isArray(subjects) || subjects.length === 0) return [];
      return Promise.all(subjects.map((subject) => getIdByName("subject_master", subject)));
    };

    const processGroup = async (group, schoolName, className) => {
      const schoolResult = await new Promise((resolve, reject) =>
        db.query(
          `SELECT school_code FROM school WHERE school_name = ?`,
          [schoolName],
          (err, result) => (err ? reject(err) : resolve(result))
        )
      );
      if (schoolResult.length === 0) {
        throw new Error(`School not found: ${schoolName}`);
      }
      // const school_code = schoolResult = schoolResult[0].school_code;
       const school_code = schoolResult[0].school_code;

      const rollResult = await new Promise((resolve, reject) =>
        db.query(
          `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1 FOR UPDATE`,
          [`${school_code}${className}%`],
          (err, result) => (err ? reject(err) : resolve(result))
        )
      );
      let newRollNumber =
        rollResult.length > 0 ? parseInt(rollResult[0].roll_no.slice(-2), 10) + 1 : 1;

      const studentsWithRollNoAndIds = [];
      for (const student of group) {
        const requiredFields = ["student_name", "school_name", "class_name"];
        const missing = requiredFields.filter((field) => !student[field]);
        if (missing.length) {
          throw new Error(`Missing fields for student: ${missing.join(", ")}`);
        }
        if (!Array.isArray(student.student_subject)) {
          throw new Error(`Invalid student_subject for ${student.student_name}`);
        }

        const [countryId, stateId, districtId, cityId, classId, subjectIds] = await Promise.all([
          getIdByName("countries", student.country),
          getIdByName("states", student.state),
          getIdByName("districts", student.district),
          getIdByName("cities", student.city),
          getIdByName("class", className),
          getSubjectIds(student.student_subject),
        ]);

        const formattedRollNo = `${school_code}${className}${String(newRollNumber).padStart(2, "0")}`;
        if (formattedRollNo.length > 20) {
          throw new Error(`Roll number too long: ${formattedRollNo}`);
        }
        newRollNumber++;

        studentsWithRollNoAndIds.push({
          ...student,
          roll_no: formattedRollNo,
          country: countryId,
          state: stateId,
          district: districtId,
          city: cityId,
          class_name: classId,
          student_subject: subjectIds,
          updated: 0, // Initialize updated field
        });
      }
      return studentsWithRollNoAndIds;
    };

    const processAllGroups = async () => {
      const errors = [];
      const allStudents = [];
      const groupPromises = Object.keys(groupedStudents).map(async (key) => {
        try {
          const [schoolName, className] = key.split("-");
          const students = await processGroup(groupedStudents[key], schoolName, className);
          return { students };
        } catch (err) {
          return { error: { group: key, message: err.message } };
        }
      });

      const results = await Promise.all(groupPromises);
      results.forEach(({ students, error }) => {
        if (error) {
          errors.push(error);
        } else {
          allStudents.push(...students);
        }
      });

      if (allStudents.length === 0 && errors.length > 0) {
        throw new Error("No valid students to insert", { cause: errors });
      }
      return { allStudents, errors };
    };

    processAllGroups()
      .then(({ allStudents, errors }) => {
        if (allStudents.length === 0) {
          return reject(new Error("No valid students to insert", { cause: errors }));
        }

        const query = `
          INSERT INTO student 
          (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, 
           country, state, district, city, approved, approved_by, created_by, updated_by, created_at, updated_at) 
          VALUES ?
        `;
        const values = allStudents.map((student) => [
          student.school_name,
          student.student_name,
          student.roll_no,
          student.class_name,
          student.student_section ?? null,
          student.mobile_number ?? null,
          student.whatsapp_number ?? null,
          JSON.stringify(student.student_subject || []),
          student.country,
          student.state,
          student.district,
          student.city,
          student.approved ?? 0,
          student.approved_by ?? null,
          userId,
          userId,
          new Date(),
          new Date(),
          
        ]);

        db.beginTransaction((err) => {
          if (err) return reject(err);
          db.query(query, [values], (err, result) => {
            if (err) {
              db.rollback(() => reject(err));
              return;
            }
            db.commit((err) => {
              if (err) {
                db.rollback(() => reject(err));
                return;
              }
              resolve({
                ...result,
                errors: errors.length ? errors : undefined,
              });
            });
          });
        });
      })
      .catch((err) =>
        reject(
          err.cause ? err : new Error("Processing failed", { cause: [err.message] })
        )
      );
  });
},

  getAllStudent: (callback) => {
    const query = "SELECT * FROM student";
    db.query(query, callback);
  },

  getAll: (page = 1, limit = 10, callback) => {
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM student LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) AS total FROM student`;

    db.query(countQuery, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
        if (err) return callback(err);

        callback(null, {
          students: result,
          currentPage: page,
          nextPage,
          prevPage,
          totalPages,
          totalRecords,
        });
      });
    });
  },

  getById: (id, callback) => {
    const query = "SELECT * FROM student WHERE id = ?";
    db.query(query, [id], callback);
  },

  update: (id, studentData, callback) => {
    const {
      school_name,
      student_name,
      class_name,
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
        SET school_name = ?, student_name = ?, class_name = ?, student_section = ?, 
            mobile_number = ?, whatsapp_number = ?, student_subject = ?, 
            approved = ?, approved_by = ?, country = ?, state = ?, district = ?, city = ?, 
            updated_at = NOW() 
        WHERE id = ?
    `;

    db.query(
      query,
      [
        school_name,
        student_name,
        class_name,
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
  getStudentsByFilters: (schoolName, classList, subjectList, callback) => {
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
        s.school_name,
        c.name AS class_name,
        sub.name AS subject_names
      FROM student s
      LEFT JOIN class c ON s.class_name = c.id
      LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss 
        ON TRUE
      LEFT JOIN subject_master sub ON ss.subject_id = sub.id
      WHERE s.school_name = ? 
        AND s.class_name IN (${placeholders}) 
        AND (${subjectJsonConditions})
        AND sub.id IN (${subjectPlaceholders})
    `;

    const countQuery = `
      SELECT COUNT(*) as total_count 
      FROM student s
      WHERE s.school_name = ? 
        AND s.class_name IN (${placeholders}) 
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
      if (err) {
        return callback(err);
      }

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) {
          return callback(countErr);
        }

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
        s.school_name,
        s.student_section,
        s.mobile_number,
        c.name AS class_name,
        sub.name AS subject_names
      FROM student s
      LEFT JOIN class c ON s.class_name = c.id
      LEFT JOIN JSON_TABLE(s.student_subject, '$[*]' COLUMNS (subject_id INT PATH '$')) AS ss
        ON TRUE
      LEFT JOIN subject_master sub ON ss.subject_id = sub.id
      WHERE s.school_name = ?
        AND s.class_name IN (${placeholders})
        AND (${subjectJsonConditions})
        AND sub.id IN (${subjectPlaceholders})
    `;

    let countQuery = `
      SELECT COUNT(*) as total_count
      FROM student s
      WHERE s.school_name = ?
        AND s.class_name IN (${placeholders})
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

    // Add rollnoclasssubject filter if provided
    if (rollnoclasssubject) {
      const [rollNo, classId, subjectId] = rollnoclasssubject.split("-");

      dataQuery += ` AND s.roll_no = ? AND s.class_name = ? AND JSON_CONTAINS(s.student_subject, ?) AND sub.id = ?`;
      countQuery += ` AND s.roll_no = ? AND s.class_name = ? AND JSON_CONTAINS(s.student_subject, ?)`;

      dataParams.push(
        rollNo,
        classId,
        JSON.stringify(Number(subjectId)),
        subjectId
      );
      countParams.push(rollNo, classId, JSON.stringify(Number(subjectId)));
    }

    db.query(dataQuery, dataParams, (err, students) => {
      if (err) {
        return callback(err);
      }

      db.query(countQuery, countParams, (countErr, countResult) => {
        if (countErr) {
          return callback(countErr);
        }

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
};

export default Student;
