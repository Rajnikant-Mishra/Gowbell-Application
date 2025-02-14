// import { db } from '../../config/db.js';

// const inventoryModel = {
//   // Create a new inventory item
//   createInventory: (inventoryData, callback) => {
//     const { item_id, date, created_by, item, quantity, unit, remarks } = inventoryData;

//     // Basic validation: Ensure all required fields are provided
//     if (!item_id || !date || !created_by || !item || !quantity || !unit) {
//       return callback(new Error('Missing required fields'), null);
//     }

//     const query = 'INSERT INTO inventory (item_id, date, created_by, item, quantity, unit, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
//     db.query(query, [item_id, date, created_by, item, quantity, unit, remarks], (error, results) => {
//       if (error) {
//         callback(error, null);
//       } else {
//         callback(null, results);
//       }
//     });
//   },

//   // Get all inventory items
//   getInventory: (callback) => {
//     const query = 'SELECT * FROM inventory';
//     db.query(query, (error, results) => {
//       if (error) {
//         callback(error, null);
//       } else {
//         callback(null, results);
//       }
//     });
//   },

//   // Get a specific inventory item by item_id
//   getInventoryById: (id, callback) => {
//     const query = 'SELECT * FROM inventory WHERE id = ?';
//     db.query(query, [id], (error, results) => {
//       if (error) {
//         callback(error, null);
//       } else {
//         callback(null, results);
//       }
//     });
//   },

//   // Update an inventory item by item_id
//   updateInventory: (id, inventoryData, callback) => {
//     const { item_id, date, created_by, item, quantity, unit, remarks } = inventoryData;
//     const query = `
//       UPDATE inventory 
//       SET item_id = ?, date = ?, created_by = ?, item = ?, quantity = ?, unit = ?, remarks = ? 
//       WHERE id = ?`;
//     const values = [item_id, date, created_by, item, quantity, unit, remarks, id];
  
//     db.query(query, values, (error, results) => {
//       if (error) {
//         callback(error, null);
//       } else {
//         callback(null, results);
//       }
//     });
//   },
  
  

//   // Delete an inventory item by item_id
//   deleteInventory: (id, callback) => {
//     const query = 'DELETE FROM inventory WHERE id = ?';
//     db.query(query, [id], (error, results) => {
//       if (error) {
//         callback(error, null);
//       } else {
//         callback(null, results);
//       }
//     });
//   },
// };

// export default inventoryModel;


import { db } from '../../config/db.js';

const inventoryModel = {
  // Create a new inventory item
  createInventory: (inventoryData, callback) => {
    const { date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details } = inventoryData;

    if (!date || !created_by || !invoice_no || !item || !quantity || !unit || !price) {
      return callback(new Error('Missing required fields'), null);
    }

    const query = `INSERT INTO inventory (date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Get all inventory items
  getInventory: (callback) => {
    const query = 'SELECT * FROM inventory ORDER BY created_at DESC';
    db.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Get inventory item by ID
  getInventoryById: (id, callback) => {
    const query = 'SELECT * FROM inventory WHERE id = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results.length > 0 ? results[0] : null);
      }
    });
  },

  // Update inventory item
  updateInventory: (id, inventoryData, callback) => {
    const { date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details } = inventoryData;

    const query = `UPDATE inventory 
                   SET date = ?, created_by = ?, invoice_no = ?, item = ?, quantity = ?, unit = ?, price = ?, remarks = ?, manufacturer_details = ?
                   WHERE id = ?`;
    const values = [date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details, id];

    db.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  // Delete inventory item
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
