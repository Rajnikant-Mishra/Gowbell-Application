import RoleMenu from "../../models/configuration/role_menuModel.js";

// Assign a menu to a role
export const assignMenu = (req, res) => {
  const roleMenuData = req.body;

  RoleMenu.assignMenuToRole(roleMenuData, (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to assign menu to role' });
      }
      res.status(201).json({ message: 'Menu assigned to role successfully', result });
  });
};

// Get menus for a specific role
export const getMenusByRole = (req, res) => {
  const { role_id } = req.params;

  RoleMenu.getMenusByRole(role_id, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to fetch menus for the role' });
      }
      res.json(results);
  });
};

// Remove a menu from a role
export const removeMenu = (req, res) => {
  const { role_id, menu_id } = req.body;

  RoleMenu.removeMenuFromRole(role_id, menu_id, (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to remove menu from role' });
      }
      res.json({ message: 'Menu removed from role successfully', result });
  });
};

// Get all role-menu mappings
export const getAllRoleMenus = (req, res) => {
  RoleMenu.getAllRoleMenus((err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to fetch role-menu mappings' });
      }
      res.json(results);
  });
};
