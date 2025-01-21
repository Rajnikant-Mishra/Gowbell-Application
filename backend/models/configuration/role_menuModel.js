import { db } from '../../config/db.js';

const RoleMenu = {
  // Assign a menu to a role
  assignMenuToRole: (roleMenuData, callback) => {
    const query = `
        INSERT INTO role_menu (role_id, menu_id)
        VALUES (?, ?)
    `;
    db.query(
        query,
        [
            roleMenuData.role_id,
            roleMenuData.menu_id
        ],
        callback
    );
  },

  // Get all menus assigned to a specific role
  getMenusByRole: (role_id, callback) => {
    const query = `
        SELECT m.*
        FROM menu m
        INNER JOIN role_menu rm ON m.id = rm.menu_id
        WHERE rm.role_id = ?
    `;
    db.query(query, [role_id], callback);
  },

  // Remove a menu assignment from a role
  removeMenuFromRole: (role_id, menu_id, callback) => {
    const query = `
        DELETE FROM role_menu
        WHERE role_id = ? AND menu_id = ?
    `;
    db.query(query, [role_id, menu_id], callback);
  },

  // Get all role-menu mappings
  getAllRoleMenus: (callback) => {
    const query = `
        SELECT rm.id, r.role_name, m.title AS menu_title
        FROM role_menu rm
        INNER JOIN roles r ON rm.role_id = r.id
        INNER JOIN menu m ON rm.menu_id = m.id
    `;
    db.query(query, callback);
  }
};

export default RoleMenu;
