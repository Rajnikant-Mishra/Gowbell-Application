import { db } from '../../config/db.js';

const inventoryModel = {
  // Create a new inventory item
  createInventory: (inventoryData, callback) => {
    const { item_id, date, created_by, item, quantity, unit, remarks } = inventoryData;

    // Basic validation: Ensure all required fields are provided
    if (!item_id || !date || !created_by || !item || !quantity || !unit) {
      return callback(new Error('Missing required fields'), null);
    }

    const query = 'INSERT INTO inventory (item_id, date, created_by, item, quantity, unit, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [item_id, date, created_by, item, quantity, unit, remarks], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Get all inventory items
  getInventory: (callback) => {
    const query = 'SELECT * FROM inventory';
    db.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Get a specific inventory item by item_id
  getInventoryById: (id, callback) => {
    const query = 'SELECT * FROM inventory WHERE id = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Update an inventory item by item_id
  updateInventory: (id, inventoryData, callback) => {
    const { item_id, date, created_by, item, quantity, unit, remarks } = inventoryData;
    const query = `
      UPDATE inventory 
      SET item_id = ?, date = ?, created_by = ?, item = ?, quantity = ?, unit = ?, remarks = ? 
      WHERE id = ?`;
    const values = [item_id, date, created_by, item, quantity, unit, remarks, id];
  
    db.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },
  
  

  // Delete an inventory item by item_id
  deleteInventory: (id, callback) => {
    const query = 'DELETE FROM inventory WHERE id = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },
};

export default inventoryModel;
