import Menu from '../../models/Menu/menuModel.js';

// Create a new menu
export const createMenu = (req, res) => {
  const menu = req.body;
  Menu.createMenu(menu, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: results.insertId, ...menu });
    }
  });
};

// Get all menus
export const getAllMenus = (req, res) => {
  Menu.getAllMenus((err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
};

// Get a single menu by ID
export const getMenuById = (req, res) => {
  const { id } = req.params;
  Menu.getMenuById(id, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Menu not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
};

// Update a menu by ID
export const updateMenu = (req, res) => {
  const { id } = req.params;
  const menu = req.body;
  Menu.updateMenu(id, menu, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Menu not found' });
    } else {
      res.status(200).json({ message: 'Menu updated successfully', id, ...menu });
    }
  });
};

// Delete a menu by ID
export const deleteMenu = (req, res) => {
  const { id } = req.params;
  Menu.deleteMenu(id, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Menu not found' });
    } else {
      res.status(200).json({ message: 'Menu deleted successfully' });
    }
  });
};
