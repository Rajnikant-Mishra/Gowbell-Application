// import { db } from "../../config/db.js";

// const PackingModel = {
  
//   fetchExamDateBySchoolAndSubject: (school, subject, callback) => {
//     const query = `SELECT exam_date FROM exam_parent WHERE school = ? AND subject = ?`;
//     db.query(query, [school, subject], (err, result) => {
//       if (err) return callback(err, null);
//       callback(null, result.length > 0 ? result[0].exam_date : null);
//     });
//   },

//   createPacking: (data, callback) => {
//     const { school, subject, exam_set, packing_no, rows } = data;

//     // Auto-generate exam_name
//     const exam_name = `GW${subject}`;

//     // Auto-set print_date to the current date
//     const print_date = new Date().toISOString().slice(0, 19).replace("T", " ");

//     // Fetch exam_date based on school and subject
//     PackingModel.fetchExamDateBySchoolAndSubject(school, subject, (err, exam_date) => {
//       if (err) {
//         callback(err);
//         return;
//       }

//       const insertQuery = `
//         INSERT INTO packing (school, subject, exam_date, exam_set, print_date, packing_no, exam_name, 
//         product_code, product_name, registered_quantity, extra_quantity, total_quantity)
//         VALUES ?`;

//       const values = rows.map((row) => [
//         school,
//         subject,
//         exam_date || null, // Use fetched exam_date or null
//         exam_set,
//         print_date, // Auto-set print_date
//         packing_no,
//         exam_name, // Auto-generated exam_name
//         row.product_code,
//         row.product_name,
//         row.registered_quantity,
//         row.extra_quantity,
//         row.total_quantity,
//       ]);

//       db.query(insertQuery, [values], (err, result) => {
//         if (err) {
//           callback(err);
//           return;
//         }
//         callback(null, { message: "Packing data inserted successfully" });
//       });
//     });
//   },

//   getAllPackings: (callback) => {
//     const query = `SELECT * FROM packing ORDER BY created_at DESC`;
//     db.query(query, callback);
//   },

//   // Delete a packing record
//   deletePacking: (id, callback) => {
//     const deleteQuery = `DELETE FROM packing WHERE id = ?`;
//     db.query(deleteQuery, [id], callback);
//   },
// };

// export default PackingModel;


import { db } from "../../config/db.js";

const PackingModel = {
  
  // Fetch exam_date based on school and subject
  fetchExamDateBySchoolAndSubject: (school, subject, callback) => {
    const query = `SELECT exam_date FROM exam_parent WHERE school = ? AND subject = ?`;
    db.query(query, [school, subject], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result.length > 0 ? result[0].exam_date : null);
    });
  },

  // Fetch school_code based on school_name
  fetchSchoolCodeByName: (school_name, callback) => {
    const query = `SELECT school_code FROM school WHERE school_name = ?`;
    db.query(query, [school_name], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result.length > 0 ? result[0].school_code : null);
    });
  },

  // Create packing record
  createPacking: (data, callback) => {
    const { school, subject, exam_set, packing_no, rows } = data;

    // Auto-generate exam_name
    const exam_name = `GW${subject}`;

    // Auto-set print_date to the current date
    const print_date = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Fetch school_code based on school_name
    PackingModel.fetchSchoolCodeByName(school, (err, school_code) => {
      if (err) {
        callback(err);
        return;
      }

      // Fetch exam_date based on school and subject
      PackingModel.fetchExamDateBySchoolAndSubject(school, subject, (err, exam_date) => {
        if (err) {
          callback(err);
          return;
        }

        const insertQuery = `
          INSERT INTO packing (school, school_code, subject, exam_date, exam_set, print_date, packing_no, exam_name, 
          product_code, product_name, registered_quantity, extra_quantity, total_quantity)
          VALUES ?`;

        const values = rows.map((row) => [
          school,
          school_code || null, // Use fetched school_code or null
          subject,
          exam_date || null, // Use fetched exam_date or null
          exam_set,
          print_date, // Auto-set print_date
          packing_no,
          exam_name, // Auto-generated exam_name
          row.product_code,
          row.product_name,
          row.registered_quantity,
          row.extra_quantity,
          row.total_quantity,
        ]);

        db.query(insertQuery, [values], (err, result) => {
          if (err) {
            callback(err);
            return;
          }
          callback(null, { message: "Packing data inserted successfully" });
        });
      });
    });
  },

  // Fetch all packings
  getAllPackings: (callback) => {
    const query = `SELECT * FROM packing ORDER BY created_at DESC`;
    db.query(query, callback);
  },

  // Delete a packing record
  deletePacking: (id, callback) => {
    const deleteQuery = `DELETE FROM packing WHERE id = ?`;
    db.query(deleteQuery, [id], callback);
  },
};

export default PackingModel;
