import { db } from "../../config/db.js";

// ✅ Create record
// export const createOmrAssign = (req, res) => {
//   const {
//     country_id,
//     state_id,
//     district_id,
//     city_id,
//     school_id,
//     class_id,
//     subject_id,
//     roll_no,
//     student_id,
//     student_section,
//     staff_id: rawStaffId, // rename to avoid clash
//     status,
//   } = req.body;

//   // ---------- 1. Validate required fields ----------
//   const required = {
//     country_id,
//     state_id,
//     district_id,
//     city_id,
//     school_id,
//     class_id,
//     subject_id,
//     student_id,

//   };

//   for (const [key, val] of Object.entries(required)) {
//     if (!val && val !== 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: `${key} is required` });
//     }
//   }

//   // ---------- 2. Staff_id – ONLY accept a positive integer ----------
//   let staff_id = null; // default = NULL
//   if (rawStaffId != null) {
//     const parsed = Number(rawStaffId);
//     if (!isNaN(parsed) && parsed > 0) {
//       staff_id = parsed; // valid → use it
//     } else {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: "staff_id must be a positive integer",
//         });
//     }
//   }

//   // ---------- 3. INSERT ----------
//   const sql = `
//     INSERT INTO omr_assign (
//       country_id, state_id, district_id, city_id,
//       school_id, class_id, subject_id, roll_no,
//       student_id, student_section, staff_id, status
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [
//       country_id,
//       state_id,
//       district_id,
//       city_id,
//       school_id,
//       class_id,
//       subject_id,
//       roll_no ?? null,
//       student_id,
//       student_section ?? null,
//       staff_id, // <-- guaranteed NULL or positive int
//       status,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("DB error:", err);
//         return res.status(500).json({ success: false, message: err.message });
//       }
//       res.status(201).json({
//         success: true,
//         message: "Record created successfully",
//         id: result.insertId,
//       });
//     }
//   );
// };

export const createOmrAssign = (req, res) => {
  const {
    country_id,
    state_id,
    district_id,
    city_id,
    school_id,
    class_id,
    subject_id,
    roll_no,
    student_id,
    student_section,
    staff_id: rawStaffId, // rename to avoid clash
    status, // optional
  } = req.body;

  // ---------- 1. Validate required fields ----------
  const required = {
    country_id,
    state_id,
    district_id,
    city_id,
    school_id,
    class_id,
    subject_id,
    student_id,
  };

  for (const [key, val] of Object.entries(required)) {
    if (!val && val !== 0) {
      return res
        .status(400)
        .json({ success: false, message: `${key} is required` });
    }
  }

  // ---------- 2. Staff_id – ONLY accept a positive integer ----------
  let staff_id = null; // default = NULL
  if (rawStaffId != null) {
    const parsed = Number(rawStaffId);
    if (!isNaN(parsed) && parsed > 0) {
      staff_id = parsed; // valid → use it
    } else {
      return res.status(400).json({
        success: false,
        message: "staff_id must be a positive integer",
      });
    }
  }

  // ---------- 3. Default Status ----------
  const finalStatus = status && status.trim() !== "" ? status : "pending";

  // ---------- 4. INSERT ----------
  const sql = `
    INSERT INTO omr_assign (
      country_id, state_id, district_id, city_id,
      school_id, class_id, subject_id, roll_no,
      student_id, student_section, staff_id, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      country_id,
      state_id,
      district_id,
      city_id,
      school_id,
      class_id,
      subject_id,
      roll_no ?? null,
      student_id,
      student_section ?? null,
      staff_id, // NULL or positive int
      finalStatus,
    ],
    (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "OMR assignment created successfully",
        id: result.insertId,
        status: finalStatus,
      });
    }
  );
};

/**
 * Update existing OMR assignment to 'success' if record exists
 */
export const updateOmrStatusIfExists = (req, res) => {
  const { school_id, class_id, subject_id, roll_no, student_id } = req.body;

  // ---------- 1. Validate minimal fields ----------
  if (!school_id || !class_id || !subject_id || !student_id) {
    return res.status(400).json({
      success: false,
      message: "school_id, class_id, subject_id, and student_id are required",
    });
  }

  // ---------- 2. Check existing record ----------
  const checkSql = `
    SELECT id 
    FROM omr_assign
    WHERE school_id = ? 
      AND class_id = ? 
      AND subject_id = ? 
      AND roll_no = ? 
      AND student_id = ?
    LIMIT 1;
  `;

  db.query(
    checkSql,
    [school_id, class_id, subject_id, roll_no, student_id],
    (checkErr, rows) => {
      if (checkErr) {
        console.error("Error checking OMR record:", checkErr);
        return res.status(500).json({
          success: false,
          message: "Database error while checking record",
          error: checkErr.message,
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No matching OMR record found",
        });
      }

      // ---------- 3. Update record ----------
      const updateSql = `
        UPDATE omr_assign
        SET status = 'success'
        WHERE id = ?;
      `;

      db.query(updateSql, [rows[0].id], (updateErr) => {
        if (updateErr) {
          console.error("Error updating OMR record:", updateErr);
          return res.status(500).json({
            success: false,
            message: "Database error while updating record",
            error: updateErr.message,
          });
        }

        return res.status(200).json({
          success: true,
          message: "OMR record updated to success",
          id: rows[0].id,
        });
      });
    }
  );
};

// ✅ Get all
export const getAllOmrAssigns = (req, res) => {
  const sql = "SELECT * FROM omr_assign ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
};

// ✅ Get one
export const getOmrAssignById = (req, res) => {
  const sql = "SELECT * FROM omr_assign WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    res.json({ success: true, data: results[0] });
  });
};

// ✅ Update
export const updateOmrAssign = (req, res) => {
  const {
    country_id,
    state_id,
    district_id,
    city_id,
    school_id,
    class_id,
    subject_id,
    roll_no,
    student_id,
    student_section,
    staff_id,
  } = req.body;

  const sql = `
    UPDATE omr_assign
    SET
      country_id = ?, state_id = ?, district_id = ?, city_id = ?,
      school_id = ?, class_id = ?, subject_id = ?, roll_no = ?,
      student_id = ?, student_section = ?, staff_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      country_id,
      state_id,
      district_id,
      city_id,
      school_id,
      class_id,
      subject_id,
      roll_no,
      student_id,
      student_section,
      staff_id,
      req.params.id,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Record updated successfully" });
    }
  );
};

// ✅ Delete
export const deleteOmrAssign = (req, res) => {
  const sql = "DELETE FROM omr_assign WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Record deleted successfully" });
  });
};
