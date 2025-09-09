import { db } from "../../config/db.js";

const Activity = {
  log: async (userId, activity, ipAddress, data = null) => {
    await db.query(
      "INSERT INTO users_activity (user_id, activity, ip_address, data) VALUES (?, ?, ?, ?)",
      [userId, activity, ipAddress, data]
    );
  },

  getAll: async () => {
    const [rows] = await db.query(
      "SELECT a.id, u.username, a.activity, a.ip_address, a.data, a.created_at " +
        "FROM users_activity a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC"
    );
    return rows;
  },
};

export default Activity;
