import { db } from "../../config/db.js";

export const AssignCenter = {
  // Create
  create: (data, callback) => {
    const query = `
      INSERT INTO assign_center 
      (country_id, state_id, district_id, city_id, assign_center_name_id, school_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [
        data.country_id || null,
        data.state_id || null,
        data.district_id || null,
        data.city_id || null,
        data.assign_center_name_id,
        JSON.stringify(data.school_id),
      ],
      callback
    );
  },

  // Read All
  // ✅ Get all with pagination and joins
  getAllPaginated: (page = 1, limit = 10, callback) => {
    const offset = (page - 1) * limit;

    const sql = `
    SELECT 
      ac.*,
      ctry.name AS country_name,
      st.name AS state_name,
      dist.name AS district_name,
      ct.name AS city_name,
      cn.center_name AS assign_center_name
    FROM assign_center ac
    LEFT JOIN countries ctry ON ac.country_id = ctry.id
    LEFT JOIN states st ON ac.state_id = st.id
    LEFT JOIN districts dist ON ac.district_id = dist.id
    LEFT JOIN cities ct ON ac.city_id = ct.id
    LEFT JOIN center cn ON ac.assign_center_name_id = cn.id
    ORDER BY ac.id DESC
    LIMIT ? OFFSET ?
  `;

    db.query(sql, [limit, offset], (err, results) => {
      if (err) return callback(err, null);
      if (!results.length)
        return callback(null, { data: [], total: 0, page, limit });

      // Collect school IDs
      const allSchoolIds = new Set();

      results.forEach((r) => {
        try {
          const ids = JSON.parse(r.school_id || "[]");
          r.school_ids = ids.map(Number).filter(Boolean);
          ids.forEach((id) => allSchoolIds.add(Number(id)));
        } catch {
          r.school_ids = [];
        }
      });

      const allIds = [...allSchoolIds];

      // Helper to finalize with total
      const finalizeResponse = (data) => {
        db.query(
          "SELECT COUNT(*) AS total FROM assign_center",
          (countErr, countResult) => {
            if (countErr) return callback(countErr, null);
            callback(null, {
              data,
              total: countResult[0].total,
              page,
              limit,
            });
          }
        );
      };

      // If no schools found in any record
      if (allIds.length === 0) return finalizeResponse(results);

      // Fetch all schools once
      db.query(
        "SELECT id, school_name FROM school WHERE id IN (?)",
        [allIds],
        (schoolErr, schoolRes) => {
          if (schoolErr) return callback(schoolErr, null);

          const schoolMap = {};
          schoolRes.forEach((s) => {
            schoolMap[s.id] = s.school_name;
          });

          // Map back to each record
          results.forEach((r) => {
            r.schools = r.school_ids.map((id) => ({
              id,
              name: schoolMap[id] || "(Unknown School)",
            }));
          });

          finalizeResponse(results);
        }
      );
    });
  },

  // Read One
  getById: (id, callback) => {
    db.query("SELECT * FROM assign_center WHERE id = ?", [id], callback);
  },

  // Update
  update: (id, data, callback) => {
    const query = `
      UPDATE assign_center 
      SET country_id = ?, state_id = ?, district_id = ?, city_id = ?, 
          assign_center_name_id = ?, school_id = ?
      WHERE id = ?
    `;
    db.query(
      query,
      [
        data.country_id || null,
        data.state_id || null,
        data.district_id || null,
        data.city_id || null,
        data.assign_center_name_id,
        JSON.stringify(data.school_id),
        id,
      ],
      callback
    );
  },

  // Delete
  delete: (id, callback) => {
    db.query("DELETE FROM assign_center WHERE id = ?", [id], callback);
  },
};

export default AssignCenter;
