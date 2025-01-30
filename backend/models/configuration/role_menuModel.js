import { db } from "../../config/db.js";

const RoleMenu = {
  // Assign a menu to multiple roles (store as a comma-separated string)
  assignMenuToRole: (roleMenuData, callback) => {
    const { menu_id, role_ids } = roleMenuData;

    // Convert the role_ids array to a comma-separated string
    const roleIdsString = Array.isArray(role_ids)
      ? role_ids.join(",")
      : role_ids;

    const query = `
        INSERT INTO role_menu (menu_id, role_ids)
        VALUES (?, ?)
    `;

    db.query(query, [menu_id, roleIdsString], (err, result) => {
      if (err) {
        console.error("Error while assigning menu to roles:", err); // Log the error
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  // Get all menus assigned to a specific role
  getMenusByRole: (role_id, callback) => {
    const query = `
        SELECT m.*
        FROM menu m
        INNER JOIN role_menu rm ON m.id = rm.menu_id
        WHERE FIND_IN_SET(?, rm.role_ids) > 0
    `;
    db.query(query, [role_id], callback);
  },

  getAllRoleMenuWithNames: (callback) => {
    const query = `
      SELECT 
      rm.id, 
      m.title AS menu_title, 
      GROUP_CONCAT(r.role_name) AS role_names,
      rm.created_at 
      FROM role_menu rm
      JOIN menu m ON rm.menu_id = m.id
      JOIN roles r ON FIND_IN_SET(r.id, rm.role_ids)
      GROUP BY rm.id
      ORDER BY created_at DESC
  `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching role menu data with names:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = `DELETE FROM role_menu WHERE id = ?`;
    db.query(query, [id], callback);
  },
};

export default RoleMenu;
