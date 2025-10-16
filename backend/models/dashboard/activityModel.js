import { db } from "../../config/db.js";

// export const logActivity = ({
//   user_id,
//   user_name,
//   activity,
//   data,
//   ip_address,
// }) => {
//   const sql = `INSERT INTO users_activity (user_id, user_name, activity, ip_address, data) VALUES (?, ?, ?, ?, ?)`;
//   db.query(
//     sql,
//     [user_id, user_name, activity, ip_address, JSON.stringify(data || {})],
//     (err) => {
//       if (err) console.error("Activity Log Error:", err);
//     }
//   );
// };

export const logActivity = (
  { session_id, user_id, user_name, activity, data, ip_address },
  callback = () => {}
) => {
  // Step 1: Resolve session_id dynamically
  const resolveSessionId = (next) => {
    if (session_id) {
      const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
      db.query(verifyQuery, [session_id], (err, result) => {
        if (err) return callback(err, null);
        if (result.length === 0)
          return callback(new Error("Invalid session ID selected"), null);
        return next(session_id);
      });
    } else {
      const sessionQuery = `
        SELECT id FROM gowvell_session
        WHERE status = 'active'
        ORDER BY id DESC
        LIMIT 1
      `;
      db.query(sessionQuery, (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0)
          return callback(new Error("No active session found"), null);
        return next(results[0].id);
      });
    }
  };

  // Step 2: Insert the activity once session_id is confirmed
  resolveSessionId((resolvedSessionId) => {
    const sql = `
      INSERT INTO users_activity 
      (session_id, user_id, user_name, activity, ip_address, data) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        resolvedSessionId,
        user_id,
        user_name,
        activity,
        ip_address,
        JSON.stringify(data || {}),
      ],
      (err) => {
        if (err) {
          console.error("Activity Log Error:", err);
          return callback(err, null);
        }
        return callback(null, { success: true, session_id: resolvedSessionId });
      }
    );
  });
};

// Get all logs with user details
// export const getAllActivities = (callback) => {
//   const sql = `
//     SELECT ua.*, u.username AS user_name
//     FROM users_activity ua
//     LEFT JOIN users u ON ua.user_id = u.id
//     ORDER BY ua.created_at DESC
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Get Activities Error:", err);
//       return callback(err, null);
//     }
//     callback(null, results);
//   });
// };

export const getAllActivities = (
  { session_id, search = "", page = 1, limit = 10 },
  callback
) => {
  const offset = (page - 1) * limit;
  let whereClause = "";
  const queryParams = [];

  // --- Session filter ---
  if (session_id) {
    whereClause = "WHERE ua.session_id = ?";
    queryParams.push(session_id);
  } else {
    whereClause = "WHERE gs.status = 'active'";
  }

  // --- Search filter (applied across multiple fields) ---
  if (search) {
    const searchClause = `
      (
        ua.activity LIKE ? OR 
        ua.ip_address LIKE ? OR 
        ua.user_name LIKE ? OR 
        ua.data LIKE ? OR 
        u.username LIKE ?
      )
    `;
    whereClause += whereClause
      ? ` AND ${searchClause}`
      : `WHERE ${searchClause}`;
    const likeValue = `%${search}%`;
    queryParams.push(likeValue, likeValue, likeValue, likeValue, likeValue);
  }

  // --- Main Query ---
  const sql = `
    SELECT 
      ua.*, 
      u.username AS user_name, 
      gs.status AS session_status
    FROM users_activity ua
    LEFT JOIN users u ON ua.user_id = u.id
    LEFT JOIN gowvell_session gs ON ua.session_id = gs.id
    ${whereClause}
    ORDER BY ua.created_at DESC
    LIMIT ? OFFSET ?
  `;

  queryParams.push(limit, offset);

  // --- Count query for pagination metadata ---
  const countSql = `
    SELECT COUNT(*) AS total
    FROM users_activity ua
    LEFT JOIN users u ON ua.user_id = u.id
    LEFT JOIN gowvell_session gs ON ua.session_id = gs.id
    ${whereClause}
  `;

  db.query(countSql, queryParams.slice(0, -2), (err, countResult) => {
    if (err) {
      console.error("Count Activities Error:", err);
      return callback(err, null);
    }

    const total = countResult[0]?.total || 0;

    db.query(sql, queryParams, (err, results) => {
      if (err) {
        console.error("Get Activities Error:", err);
        return callback(err, null);
      }
      callback(null, {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        activities: results,
      });
    });
  });
};
