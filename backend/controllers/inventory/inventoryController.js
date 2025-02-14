// import inventoryModel from '../../models/Inventory/inventoryModel.js';

// // Create a new inventory item
// export const createInventory = (req, res) => {
//   const { item_id, date, created_by, item, quantity, unit, remarks } = req.body;

//   // Validate required fields
//   if (!item_id || !date || !created_by || !item || !quantity || !unit) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   const inventoryData = { item_id, date, created_by, item, quantity, unit, remarks };

//   inventoryModel.createInventory(inventoryData, (error, results) => {
//     if (error) {
//       console.error('Error creating inventory item:', error); // Log the error for debugging
//       return res.status(500).json({ error: 'Error creating inventory item' });
//     }

//     res.status(201).json({ message: 'Inventory item created successfully', results });
//   });
// };

// // Get all inventory items
// export const getInventory = (req, res) => {
//   inventoryModel.getInventory((error, results) => {
//     if (error) {
//       console.error('Error fetching inventory items:', error);
//       return res.status(500).json({ error: 'Error fetching inventory items' });
//     }
//     res.status(200).json(results);
//   });
// };

// // Get a specific inventory item by item_id
// export const getInventoryById = (req, res) => {
//   const { id } = req.params;

//   inventoryModel.getInventoryById(id, (error, results) => {
//     if (error) {
//       console.error('Error fetching inventory item by ID:', error);
//       return res.status(500).json({ error: 'Error fetching inventory item' });
//     } else if (results.length === 0) {
//       return res.status(404).json({ message: 'Inventory item not found' });
//     } else {
//       res.status(200).json(results[0]);
//     }
//   });
// };

// // Update an inventory item by item_id
// export const updateInventory = (req, res) => {
//   const { id } = req.params;
//   const { item_id, date, created_by, item, quantity, unit, remarks } = req.body;

//   // Validate required fields
//   if (!item_id || !date || !created_by || !item || !quantity || !unit) {
//     return res.status(400).json({ error: 'Missing required fields for update' });
//   }

//   // Ensure item_id is valid (check if it's a number or valid format if needed)
//   if (!id || isNaN(id)) {
//     return res.status(400).json({ error: 'Invalid item ID' });
//   }

//   // Convert date to MySQL-compatible format
//   const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

//   const inventoryData = {
//     item_id,
//     date: formattedDate,
//     created_by,
//     item,
//     quantity,
//     unit,
//     remarks,
//   };

//   inventoryModel.updateInventory(id, inventoryData, (error, results) => {
//     if (error) {
//       console.error('Error updating inventory item:', error);
//       return res.status(500).json({ error: 'Error updating inventory item' });
//     } else if (results.affectedRows === 0) {
//       return res.status(404).json({ message: 'Inventory item not found' });
//     } else {
//       res.status(200).json({ message: 'Inventory item updated successfully', results });
//     }
//   });
// };

  

// // Delete an inventory item by item_id
// export const deleteInventory = (req, res) => {
//   const { id } = req.params;

//   inventoryModel.deleteInventory(id, (error, results) => {
//     if (error) {
//       console.error('Error deleting inventory item:', error);
//       return res.status(500).json({ error: 'Error deleting inventory item' });
//     } else if (results.affectedRows === 0) {
//       return res.status(404).json({ message: 'Inventory item not found' });
//     } else {
//       res.status(200).json({ message: 'Inventory item deleted successfully' });
//     }
//   });
// };


import inventoryModel from '../../models/Inventory/inventoryModel.js';

// Create a new inventory item
export const createInventory = (req, res) => {
  const { date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details } = req.body;

  if (!date || !created_by || !invoice_no || !item || !quantity || !unit || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const inventoryData = { date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details };

  inventoryModel.createInventory(inventoryData, (error, results) => {
    if (error) {
      console.error('Error creating inventory:', error);
      return res.status(500).json({ error: 'Error creating inventory' });
    }

    res.status(201).json({ message: 'Inventory item created successfully', results });
  });
};

// Get all inventory items
export const getInventory = (req, res) => {
  inventoryModel.getInventory((error, results) => {
    if (error) {
      console.error('Error fetching inventory:', error);
      return res.status(500).json({ error: 'Error fetching inventory' });
    }
    res.status(200).json(results);
  });
};

// Get inventory item by ID
export const getInventoryById = (req, res) => {
  const { id } = req.params;

  inventoryModel.getInventoryById(id, (error, results) => {
    if (error) {
      console.error('Error fetching inventory item:', error);
      return res.status(500).json({ error: 'Error fetching inventory item' });
    } else if (!results) {
      return res.status(404).json({ message: 'Inventory item not found' });
    } else {
      res.status(200).json(results);
    }
  });
};

// Update inventory item
export const updateInventory = (req, res) => {
  const { id } = req.params;
  const { date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details } = req.body;

  if (!date || !created_by || !invoice_no || !item || !quantity || !unit || !price) {
    return res.status(400).json({ error: 'Missing required fields for update' });
  }

  const inventoryData = { date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details };

  inventoryModel.updateInventory(id, inventoryData, (error, results) => {
    if (error) {
      console.error('Error updating inventory:', error);
      return res.status(500).json({ error: 'Error updating inventory' });
    } else if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    } else {
      res.status(200).json({ message: 'Inventory item updated successfully' });
    }
  });
};

// Delete inventory item
export const deleteInventory = (req, res) => {
  const { id } = req.params;

  inventoryModel.deleteInventory(id, (error, results) => {
    if (error) {
      console.error('Error deleting inventory:', error);
      return res.status(500).json({ error: 'Error deleting inventory' });
    } else if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    } else {
      res.status(200).json({ message: 'Inventory item deleted successfully' });
    }
  });
};
