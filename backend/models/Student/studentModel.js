import { db } from "../../config/db.js";

export const Student = {
  
  // create: (studentData, userId, callback) => {
  //   const {
  //     school_name,
  //     student_name,
  //     class_name,
  //     student_section,
  //     mobile_number,
  //     whatsapp_number,
  //     student_subject,
  //     approved,
  //     approved_by,
  //   } = studentData;

  //   // Step 1: Get school_code from school table
  //   const schoolQuery = `SELECT school_code FROM school WHERE school_name = ?`;

  //   db.query(schoolQuery, [school_name], (err, schoolResult) => {
  //     if (err) return callback(err);

  //     if (schoolResult.length === 0) {
  //       return callback(new Error("School not found"));
  //     }

  //     const school_code = schoolResult[0].school_code;

  //     // Step 2: Get the last roll_no for this school_code and class_name
  //     const rollQuery = `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`;
  //     const rollPrefix = `${school_code}${class_name}%`;

  //     db.query(rollQuery, [rollPrefix], (err, rollResult) => {
  //       if (err) return callback(err);

  //       let newRollNumber = 1;
  //       if (rollResult.length > 0) {
  //         const lastRoll = rollResult[0].roll_no;
  //         const lastRollNumber = parseInt(lastRoll.slice(-2), 10); // Extract last 2 digits
  //         newRollNumber = lastRollNumber + 1;
  //       }

  //       const formattedRollNo = `${school_code}${class_name}${String(
  //         newRollNumber
  //       ).padStart(2, "0")}`;

  //       // Step 3: Insert the new student record
  //       const insertQuery = `
  //         INSERT INTO student 
  //         (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, created_by, updated_by, created_at, updated_at) 
  //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  //       `;

  //       db.query(
  //         insertQuery,
  //         [
  //           school_name,
  //           student_name,
  //           formattedRollNo,
  //           class_name,
  //           student_section,
  //           mobile_number,
  //           whatsapp_number,
  //           JSON.stringify(student_subject || []) || null, // Convert JSON array to string
  //           approved,
  //           approved_by,
  //           userId, // Created by logged-in user
  //           userId, // Updated by logged-in user
  //         ],
  //         callback
  //       );
  //     });
  //   });
  // },

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
      city
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
  bulkCreate: (students, userId, callback) => {
    // Step 1: Group students by school_name and class_name
    const groupedStudents = students.reduce((acc, student) => {
      const key = `${student.school_name}-${student.class_name}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(student);
      return acc;
    }, {});

    // Step 2: Process each group to generate roll_no
    const processGroup = (group, schoolName, className, callback) => {
      // Get school_code from school table
      const schoolQuery = `SELECT school_code FROM school WHERE school_name = ?`;

      db.query(schoolQuery, [schoolName], (err, schoolResult) => {
        if (err) return callback(err);

        if (schoolResult.length === 0) {
          return callback(new Error(`School not found: ${schoolName}`));
        }

        const school_code = schoolResult[0].school_code;

        // Get the last roll_no for this school_code and class_name
        const rollQuery = `SELECT roll_no FROM student WHERE roll_no LIKE ? ORDER BY roll_no DESC LIMIT 1`;
        const rollPrefix = `${school_code}${className}%`;

        db.query(rollQuery, [rollPrefix], (err, rollResult) => {
          if (err) return callback(err);

          let newRollNumber = 1;
          if (rollResult.length > 0) {
            const lastRoll = rollResult[0].roll_no;
            const lastRollNumber = parseInt(lastRoll.slice(-2), 10); // Extract last 2 digits
            newRollNumber = lastRollNumber + 1;
          }

          // Generate roll_no for each student in the group
          const studentsWithRollNo = group.map((student, index) => {
            const formattedRollNo = `${school_code}${className}${String(
              newRollNumber + index
            ).padStart(2, "0")}`;
            return {
              ...student,
              roll_no: formattedRollNo,
            };
          });

          callback(null, studentsWithRollNo);
        });
      });
    };

    // Step 3: Process all groups and collect results
    const processAllGroups = async () => {
      const allStudents = [];
      for (const key of Object.keys(groupedStudents)) {
        const [schoolName, className] = key.split("-");
        const group = groupedStudents[key];
        await new Promise((resolve, reject) => {
          processGroup(
            group,
            schoolName,
            className,
            (err, studentsWithRollNo) => {
              if (err) return reject(err);
              allStudents.push(...studentsWithRollNo);
              resolve();
            }
          );
        });
      }
      return allStudents;
    };

    // Step 4: Insert all students with generated roll_no
    processAllGroups()
      .then((allStudents) => {
        const query = `
          INSERT INTO student 
          (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, country, state, district, city, approved, approved_by, created_by, updated_by, created_at, updated_at) 
          VALUES ?
        `;

        // Convert student objects to an array of arrays for bulk insertion
        const values = allStudents.map((student) => [
          student.school_name,
          student.student_name,
          student.roll_no,
          student.class_name,
          student.student_section,
          student.mobile_number,
          student.whatsapp_number,
          JSON.stringify(student.student_subject || []) || null, // Convert JSON array to string
          student.country,
          student.state,
          student.district,
          student.city,
          student.approved,
          student.approved_by,
          userId, // Created by logged-in user
          userId, // Updated by logged-in user
          new Date(), // created_at
          new Date(), // updated_at
        ]);

        // Execute the query with the array of values
        db.query(query, [values], callback);
      })
      .catch(callback);
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

  // update: (id, studentData, callback) => {
  //   const {
  //     school_name,
  //     student_name,
  //     class_name,
  //     student_section,
  //     mobile_number,
  //     whatsapp_number,
  //     student_subject,
  //     approved,
  //     approved_by,
  //   } = studentData;

  //   const query = `
  //       UPDATE student 
  //       SET school_name = ?, student_name = ?, class_name = ?, student_section = ?, 
  //           mobile_number = ?, whatsapp_number = ?, student_subject = ?, 
  //           approved = ?, approved_by = ?, updated_at = NOW() 
  //       WHERE id = ?
  //   `;

  //   db.query(
  //     query,
  //     [
  //       school_name,
  //       student_name,
  //       class_name,
  //       student_section,
  //       mobile_number,
  //       whatsapp_number,
  //       student_subject,
  //       approved,
  //       approved_by,
  //       id,
  //     ],
  //     callback
  //   );
  // },

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

  getStudentsByClass: (school_name, class_from, class_to, callback) => {
    const query = `
          SELECT * FROM student
          WHERE school_name = ? AND class_name BETWEEN ? AND ?;
      `;
    db.query(query, [school_name, class_from, class_to], callback);
  },

  // Fetch classes by school
  getClassesBySchool: (school_name, callback) => {
    const query = `
      SELECT DISTINCT class_name
      FROM student
      WHERE school_name = ?
      ORDER BY class_name;
    `;
    db.query(query, [school_name], callback);
  },

  //Fetch subjects by class and school
  getStudentsBySubjectClassAndSchool: (
    school_name,
    class_name,
    student_subject,
    callback
  ) => {
    const query = `
    SELECT 
      id, 
      student_name, 
      school_name, 
      class_name, 
      roll_no,
      JSON_ARRAY(JSON_EXTRACT(student_subject, '$[0]')) AS student_subject -- Extract only the matching subject
    FROM student
    WHERE 
      school_name = ? AND 
      class_name = ? AND 
      JSON_CONTAINS(student_subject, JSON_ARRAY(?)) -- Check if the subject exists in the array
    ORDER BY student_name;
  `;
    db.query(query, [school_name, class_name, student_subject], callback);
  },
};

export default Student;
