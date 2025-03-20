// import { db } from "../../config/db.js";

// const ResultModel = {
//   bulkUpload: (students, callback) => {
//     if (!Array.isArray(students) || students.length === 0) {
//       return callback("No student data provided");
//     }

//     const values = students.map((student) => [
//       student.student_name,
//       student.class,
//       student.roll_no,
//       student.full_mark,
//       student.mark_secured,
//       student.percentage,
//       student.level,
//       student.subject,
//       student.medals || "None",
//       student.certificate || null,
//       student.remarks || null,
//     ]);

//     const query = `
//       INSERT INTO result 
//       (student_name, class, roll_no, full_mark, mark_secured, percentage, level, subject, medals, certificate, remarks) 
//       VALUES ?
//       ON DUPLICATE KEY UPDATE 
//         full_mark = VALUES(full_mark), 
//         mark_secured = VALUES(mark_secured), 
//         percentage = VALUES(percentage), 
//         medals = VALUES(medals), 
//         certificate = VALUES(certificate), 
//         remarks = VALUES(remarks), 
//         updated_at = CURRENT_TIMESTAMP
//     `;

//     db.query(query, [values], (err, result) => {
//       if (err) return callback(err);
//       callback(null, { message: `${result.affectedRows} records inserted/updated successfully` });
//     });
//   }

  
// };

// export default ResultModel;
import { db } from "../../config/db.js";

const ResultModel = {
  // Bulk Upload Results
  bulkUpload: (students, callback) => {
    if (!Array.isArray(students) || students.length === 0) {
      return callback("No student data provided");
    }

    const values = students.map((student) => [
      student.student_name,
      student.class,
      student.roll_no,
      student.full_mark,
      student.mark_secured,
      student.percentage,
      student.level,
      student.subject,
      student.medals || "None",
      student.certificate || null,
      student.remarks || null,
    ]);

    const query = `
      INSERT INTO result 
      (student_name, class, roll_no, full_mark, mark_secured, percentage, level, subject, medals, certificate, remarks) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE 
        full_mark = VALUES(full_mark), 
        mark_secured = VALUES(mark_secured), 
        percentage = VALUES(percentage), 
        medals = VALUES(medals), 
        certificate = VALUES(certificate), 
        remarks = VALUES(remarks), 
        updated_at = CURRENT_TIMESTAMP
    `;

    db.query(query, [values], (err, result) => {
      if (err) return callback(err);
      callback(null, { message: `${result.affectedRows} records inserted/updated successfully` });
    });
  },

  // Fetch all results
  // getAllResults: (callback) => {
  //   const query = "SELECT * FROM result ORDER BY created_at DESC";
  //   db.query(query, (err, results) => {
  //     if (err) return callback(err);
  //     callback(null, results);
  //   });
  // }
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
};

export default ResultModel;
