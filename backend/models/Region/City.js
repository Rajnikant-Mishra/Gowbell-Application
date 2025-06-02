import { db } from "../../config/db.js";

export const City = {
  create: (
    name,
    country_id,
    state_id,
    district_id,
    status,
    created_by,
    callback
  ) => {
    // First, check if the city already exists in the database
    db.query(
      "SELECT * FROM cities WHERE name = ? AND country_id = ? AND state_id = ? AND district_id = ?",
      [name, country_id, state_id, district_id],
      (err, result) => {
        if (err) {
          console.error("Error checking for duplicate city:", err);
          return callback(err, null);
        }

        // If a city already exists with the same name, country_id, state_id, and district_id
        if (result.length > 0) {
          return callback(new Error("City already exists"), null);
        }

        // If no duplicate, proceed with the insert
        db.query(
          "INSERT INTO cities (name, country_id, state_id, district_id, status, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            name,
            country_id,
            state_id,
            district_id,
            status,
            created_by,
            created_by,
          ], // updated_by initially same as created_by
          callback
        );
      }
    );
  },

  getAllcities: (callback) => {
    db.query("SELECT * FROM cities", callback);
  },

  // Model function for fetching paginated city data
  // getAll: (page = 1, limit = 10, callback) => {
  //   const offset = (page - 1) * limit;

  //   const query = `SELECT * FROM cities LIMIT ? OFFSET ?`;
  //   const countQuery = `SELECT COUNT(*) AS total FROM cities`;

  //   db.query(countQuery, (err, countResult) => {
  //     if (err) return callback(err);

  //     const totalRecords = countResult[0].total;
  //     const totalPages = Math.ceil(totalRecords / limit);
  //     const nextPage = page < totalPages ? page + 1 : null;
  //     const prevPage = page > 1 ? page - 1 : null;

  //     db.query(query, [limit, offset], (err, results) => {
  //       if (err) return callback(err);

  //       callback(null, {
  //         cities: results,
  //         currentPage: page,
  //         nextPage,
  //         prevPage,
  //         totalPages,
  //         totalRecords,
  //       });
  //     });
  //   });
  // },

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
        c.name LIKE ? OR
        c.status LIKE ? OR
        c.created_by LIKE ? OR
        c.updated_by LIKE ? OR
        co.name LIKE ? OR
        s.name LIKE ? OR
        d.name LIKE ?`;
      queryParams.push(...Array(7).fill(`%${search.trim()}%`));
    }

    const query = `
    SELECT 
      c.*,
      co.name AS country_name,
      s.name AS state_name,
      d.name AS district_name
    FROM cities c
    LEFT JOIN countries co ON c.country_id = co.id
    LEFT JOIN states s ON c.state_id = s.id
    LEFT JOIN districts d ON c.district_id = d.id
    ${whereClause}
    ORDER BY c.id DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total 
    FROM cities c
    LEFT JOIN countries co ON c.country_id = co.id
    LEFT JOIN states s ON c.state_id = s.id
    LEFT JOIN districts d ON c.district_id = d.id
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
          cities: results || [],
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
    db.query("SELECT * FROM cities WHERE id = ?", [id], callback);
  },

  update: (id, name, country_id, state_id, district_id, status, callback) => {
    // Check for duplicate city before updating
    db.query(
      "SELECT * FROM cities WHERE name = ? AND country_id = ? AND state_id = ? AND district_id = ? AND id != ?",
      [name, country_id, state_id, district_id, id],
      (err, result) => {
        if (err) {
          console.error(
            "Error checking for duplicate city during update:",
            err
          );
          return callback(err, null);
        }

        // If a city already exists with the same name, country_id, state_id, and district_id
        if (result.length > 0) {
          return callback(new Error("City already exists"), null);
        }

        // If no duplicate, proceed with the update
        db.query(
          "UPDATE cities SET name = ?, country_id = ?, state_id = ?, district_id = ?, status = ? WHERE id = ?",
          [name, country_id, state_id, district_id, status, id],
          callback
        );
      }
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM cities WHERE id = ?", [id], callback);
  },
};
