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
      student.status || "pending",
    ]);

    const query = `
      INSERT INTO result 
      (student_name, class, roll_no, full_mark, mark_secured, percentage, level, subject, medals, certificate, remarks, status) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE 
        full_mark = VALUES(full_mark), 
        mark_secured = VALUES(mark_secured), 
        percentage = VALUES(percentage), 
        medals = VALUES(medals), 
        certificate = VALUES(certificate), 
        remarks = VALUES(remarks), 
        status = VALUES(status),
        updated_at = CURRENT_TIMESTAMP
    `;

    db.query(query, [values], (err, result) => {
      if (err) return callback(err);
      callback(null, {
        message: `${result.affectedRows} records inserted/updated successfully`,
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
        return callback(null, { message: "No record found with the provided ID" });
      }
      callback(null, { message: "Record deleted successfully" });
    });
  },

  // Calculate and update percentages for rows with status "pending"
  updatePendingPercentages: (callback) => {
    const query = `
      WITH RankedResults AS (
        SELECT 
          id,
          ROW_NUMBER() OVER (PARTITION BY class, subject ORDER BY mark_secured DESC) AS student_rank
        FROM result
        WHERE status = 'pending' AND full_mark > 0
      )
      UPDATE result r
      JOIN RankedResults rr ON r.id = rr.id
      SET 
        r.percentage = (r.mark_secured / r.full_mark) * 100,
        r.status = 'success',
        r.certificate = CASE 
                    WHEN (r.mark_secured / r.full_mark) * 100 >= 90 AND (r.mark_secured / r.full_mark) * 100 <= 100 THEN 'Excellence'
                    WHEN (r.mark_secured / r.full_mark) * 100 >= 80 AND (r.mark_secured / r.full_mark) * 100 < 90 THEN 'Merit'
                    ELSE NULL
                  END,
                  r.remarks = CASE 
                    WHEN (r.mark_secured / r.full_mark) * 100 >= 90 AND (r.mark_secured / r.full_mark) * 100 <= 100 THEN 'Outstanding Performance'
                    WHEN (r.mark_secured / r.full_mark) * 100 >= 80 AND (r.mark_secured / r.full_mark) * 100 < 90 THEN 'Good Performance'
                    ELSE NULL
                  END,
                   r.level = CASE 
                     WHEN rr.student_rank = 1 THEN '1'
                     WHEN rr.student_rank = 2 THEN '2'
                     WHEN rr.student_rank = 3 THEN '3'
                     ELSE NULL
                   END,
        r.medals = CASE 
                     WHEN rr.student_rank = 1 THEN 'Gold'
                     WHEN rr.student_rank = 2 THEN 'Silver'
                     WHEN rr.student_rank = 3 THEN 'Bronze'
                     ELSE NULL
                   END,
        r.updated_at = CURRENT_TIMESTAMP
      WHERE r.status = 'pending' AND r.full_mark > 0
    `;

    db.query(query, (err, result) => {
      if (err) return callback(err);
      callback(null, {
        message: `${result.affectedRows} pending records updated`,
      });
    });
  },
};

export default ResultModel;
