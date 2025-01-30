

import RoleMenu from "../../models/configuration/role_menuModel.js";

// Assign a menu to multiple roles
export const assignMenu = (req, res) => {
  const { menu_id, role_ids } = req.body;

  if (!menu_id || !Array.isArray(role_ids) || role_ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input. menu_id and role_ids are required.' });
  }

  RoleMenu.assignMenuToRole({ menu_id, role_ids }, (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to assign menu to roles', details: err.message });
      }
      res.status(201).json({ message: 'Menu assigned to roles successfully', result });
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


//getall rolesmenus
export const getAllRoleMenu = (req, res) => {
    RoleMenu.getAllRoleMenuWithNames((err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch role-menu data with names', details: err.message });
        }
        res.status(200).json({ message: 'Data fetched successfully', data: results });
    });
};


export const deleteRoleMenu = (req, res) => {
    const { id } = req.params;
    RoleMenu.delete(id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'RoleMenu deleted successfully' });
    });

};