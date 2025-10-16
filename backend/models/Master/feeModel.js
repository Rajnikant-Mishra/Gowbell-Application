import { db } from "../../config/db.js";

export const Fee = {
  create: (subject_fee, callback) => {
    const sql = "INSERT INTO fee (subject_fee) VALUES (?)";
    db.query(sql, [subject_fee], callback);
  },

  findAll: (callback) => {
    const sql = "SELECT * FROM fee";
    db.query(sql, callback);
  },

  getAll: (page = 1, limit = 10, callback) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM fee
      ORDER BY id DESC
      LIMIT ? OFFSET ?;
    `;

    const countQuery = `
      SELECT COUNT(*) AS total FROM fee;
    `;

    db.query(countQuery, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0]?.total || 0;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      db.query(query, [limit, offset], (err, results) => {
        if (err) return callback(err);
        callback(null, {
          fees: results || [],
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
    const sql = "SELECT * FROM fee WHERE id = ?";
    db.query(sql, [id], callback);
  },

  update: (id, subject_fee, callback) => {
    const sql = `
      UPDATE fee 
      SET subject_fee = ? 
      WHERE id = ?
    `;
    db.query(sql, [subject_fee, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM fee WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

export default Fee;
