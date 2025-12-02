import { db } from "../../config/db.js";

export const Center = {
  getAll: (callback) => {
    db.query("SELECT * FROM center", callback);
  },

  // Model
  getCenterAll: (page = 1, limit = 10, search = "", callback) => {
    // Validate inputs
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    if (page < 1 || limit < 1) {
      return callback(new Error("Page and limit must be positive integers"));
    }

    const offset = (page - 1) * limit;
    let whereClause = "";
    const queryParams = [];

    // Build search conditions
    if (search && search.trim() !== "") {
      whereClause = `
      WHERE 
        center_name LIKE ?`;
      queryParams.push(...Array(3).fill(`%${search.trim()}%`));
    }

    const query = `
    SELECT *
    FROM center
    ${whereClause}
    ORDER BY id DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM center
    ${whereClause};
  `;

    // Get total count first
    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0]?.total || 0;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      // Get paginated results
      db.query(query, [...queryParams, limit, offset], (err, results) => {
        if (err) return callback(err);

        callback(null, {
          centers: results || [],
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
    db.query("SELECT * FROM center WHERE center_id = ?", [id], callback);
  },

  create: (data, callback) => {
    // Step 1️⃣: Check if center_name already exists
    const checkQuery = "SELECT * FROM center WHERE center_name = ?";
    db.query(checkQuery, [data.center_name], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        // Duplicate found
        return callback({ duplicate: true });
      }

      // Step 2️⃣: Generate new code
      const getLastCodeQuery = `
      SELECT center_code FROM center
      WHERE center_code IS NOT NULL
      ORDER BY id DESC
      LIMIT 1
    `;

      db.query(getLastCodeQuery, (err2, results2) => {
        if (err2) return callback(err2);

        let newCode = "CE-0001";
        if (results2 && results2.length > 0 && results2[0].center_code) {
          const lastCode = results2[0].center_code;
          const numberPart = parseInt(lastCode.replace("CE-", "")) || 0;
          const nextNumber = numberPart + 1;
          newCode = `CE-${nextNumber.toString().padStart(4, "0")}`;
        }

        // Step 3️⃣: Insert new record with address
        const insertQuery = `
        INSERT INTO center (center_name, center_code, address)
        VALUES (?, ?, ?)
      `;
        db.query(
          insertQuery,
          [data.center_name, newCode, data.address || null],
          (insertErr, result) => {
            if (insertErr) return callback(insertErr);

            const createdCenter = {
              id: result.insertId,
              center_name: data.center_name,
              center_code: newCode,
              address: data.address || null,
            };

            callback(null, createdCenter);
          }
        );
      });
    });
  },

  update: (id, data, callback) => {
    const query = `
    UPDATE center
    SET center_name = ?, center_code = ?, address = ?
    WHERE id = ?
  `;

    db.query(
      query,
      [data.center_name, data.center_code, data.address || null, id],
      (err, result) => {
        if (err) return callback(err);
        if (result.affectedRows === 0) {
          return callback({ notFound: true });
        }
        callback(null, { message: "Center updated successfully" });
      }
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM center WHERE center_id = ?", [id], callback);
  },
};

export default Center;
