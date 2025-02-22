import { db } from "../../config/db.js";

export const Student = {
  // create: (studentData, callback) => {
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
  //     // student_code,
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
  //               INSERT INTO student
  //               (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, student_code, created_at, updated_at)
  //               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  //           `;

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
  //           student_subject,
  //           approved,
  //           approved_by,
  //           student_code,
  //         ],
  //         callback
  //       );
  //     });
  //   });
  // },

  create: (studentData, callback) => {
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
                (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
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
            student_subject,
            approved,
            approved_by,
          ],
          callback
        );
      });
    });
  },

  //BULK UPLOAD
  // bulkCreate: (students, callback) => {
  //   // Ensure bulk insertion query is properly constructed
  //   const query = `
  //     INSERT INTO student
  //     (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, student_code, created_at, updated_at)
  //     VALUES ?
  //   `;

  //   // Convert student objects to an array of arrays for bulk insertion
  //   const values = students.map(student => [
  //     student.school_name,
  //     student.student_name,
  //     student.roll_no,
  //     student.class_name,
  //     student.student_section,
  //     student.mobile_number,
  //     student.whatsapp_number,
  //     student.student_subject,
  //     student.approved,
  //     student.approved_by,
  //     student.student_code,
  //     new Date(), // This will insert the current date and time for created_at
  //     new Date()  // This will insert the current date and time for updated_at
  //   ]);

  //   // Execute the query with the array of values
  //   db.query(query, [values], callback);
  // },

  // BULK UPLOAD
  // bulkCreate: (students, callback) => {
  //   // Ensure bulk insertion query is properly constructed
  //   const query = `
  //   INSERT INTO student
  //   (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, student_code, created_at, updated_at)
  //   VALUES ?
  // `;

  //   // Convert student objects to an array of arrays for bulk insertion
  //   const values = students.map((student) => [
  //     student.school_name,
  //     student.student_name,
  //     student.roll_no,
  //     student.class_name,
  //     student.student_section,
  //     student.mobile_number,
  //     student.whatsapp_number,
  //     student.student_subject,
  //     student.approved,
  //     student.approved_by,
  //     student.student_code ||
  //       `${student.school_name?.slice(0, 3).toUpperCase()}-${Date.now()}`, // Ensure unique student code
  //     new Date(), // created_at
  //     new Date(), // updated_at
  //   ]);

  //   // Execute the query with the array of values
  //   db.query(query, [values], callback);
  // },
  bulkCreate: (students, callback) => {
    // Ensure bulk insertion query is properly constructed
    const query = `
    INSERT INTO student 
    (school_name, student_name, roll_no, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, created_at, updated_at) 
    VALUES ?
  `;

    // Convert student objects to an array of arrays for bulk insertion
    const values = students.map((student) => [
      student.school_name,
      student.student_name,
      student.roll_no,
      student.class_name,
      student.student_section,
      student.mobile_number,
      student.whatsapp_number,
      student.student_subject,
      student.approved,
      student.approved_by,
      new Date(), // created_at
      new Date(), // updated_at
    ]);

    // Execute the query with the array of values
    db.query(query, [values], callback);
  },

  getAll: (callback) => {
    const query = "SELECT * FROM student";
    db.query(query, callback);
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
  //   const query =
  //     "UPDATE student SET school_name = ?, student_name = ?, class_name = ?, student_section = ?, mobile_number = ?, whatsapp_number = ?, student_subject = ?, approved = ?, approved_by = ?, updated_at = NOW() WHERE id = ?";
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
    } = studentData;

    const query = `
        UPDATE student 
        SET school_name = ?, student_name = ?, class_name = ?, student_section = ?, 
            mobile_number = ?, whatsapp_number = ?, student_subject = ?, 
            approved = ?, approved_by = ?, updated_at = NOW() 
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
};

export default Student;
