import { db } from "../../config/db.js";

export const Class = {
  // create: (name, status, callback) => {
  //     const sql = 'INSERT INTO class (name, status) VALUES (?, ?)';
  //     db.query(sql, [name, status], callback);
  // },
  create: (name, status, created_by, callback) => {
    const sql = "INSERT INTO class (name, status, created_by) VALUES (?, ?, ?)";
    db.query(sql, [name, status, created_by], callback);
  },

  findAll: (callback) => {
    const sql = "SELECT * FROM class";
    db.query(sql, callback);
  },

  getAll: (page = 1, limit = 10, search = "", callback) => {
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
        name LIKE ? OR
        created_by LIKE ? OR
        updated_by LIKE ?`;
      queryParams.push(...Array(3).fill(`%${search.trim()}%`));
    }

    const query = `
    SELECT *
    FROM class
    ${whereClause}
    ORDER BY id DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total 
    FROM class
    ${whereClause};
  `;

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0]?.total || 0;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      db.query(query, [...queryParams, limit, offset], (err, results) => {
        if (err) return callback(err);

        callback(null, {
          classes: results || [],
          currentPage: page,
          nextPage,
          prevPage,
          totalPages,
          totalRecords,
        });
      });
    });
  },

  findById: (id, callback) => {
    const sql = "SELECT * FROM class WHERE id = ?";
    db.query(sql, [id], callback);
  },

  update: (id, name, status, callback) => {
    const sql =
      "UPDATE class SET name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    db.query(sql, [name, status, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM class WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

export default Class;
