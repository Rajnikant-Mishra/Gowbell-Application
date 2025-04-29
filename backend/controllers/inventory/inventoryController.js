import inventoryModel from "../../models/Inventory/inventoryModel.js";

// Create a new inventory item
// export const createInventory = (req, res) => {
//   const { date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details } = req.body;

//   if (!date || !invoice_no || !item || !quantity || !unit || !price) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   const inventoryData = { date, created_by, invoice_no, item, quantity, unit, price, remarks, manufacturer_details };

//   inventoryModel.createInventory(inventoryData, (error, results) => {
//     if (error) {
//       console.error('Error creating inventory:', error);
//       return res.status(500).json({ error: 'Error creating inventory' });
//     }

//     res.status(201).json({ message: 'Inventory item created successfully', results });
//   });
// };

export const createInventory = (req, res) => {
  const { date, invoice_no, item, sub_item, quantity, unit, price, remarks, manufacturer_details } = req.body;
  
  // Ensure the request contains a valid user ID from the token
  const created_by = req.user.id; 

  if (!date || !invoice_no || !item || !quantity || !unit || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const inventoryData = { date, created_by, invoice_no, item, sub_item, quantity, unit, price, remarks, manufacturer_details };

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
      console.error("Error fetching inventory:", error);
      return res.status(500).json({ error: "Error fetching inventory" });
    }
    res.status(200).json(results);
  });
};

// Get inventory item by ID
export const getInventoryById = (req, res) => {
  const { id } = req.params;

  inventoryModel.getInventoryById(id, (error, results) => {
    if (error) {
      console.error("Error fetching inventory item:", error);
      return res.status(500).json({ error: "Error fetching inventory item" });
    } else if (!results) {
      return res.status(404).json({ message: "Inventory item not found" });
    } else {
      res.status(200).json(results);
    }
  });
};

// Update inventory item
export const updateInventory = (req, res) => {
  const { id } = req.params;
  const {
    date,
    created_by,
    invoice_no,
    item,
    quantity,
    unit,
    price,
    remarks,
    manufacturer_details,
  } = req.body;

  if (
    !date ||
    !created_by ||
    !invoice_no ||
    !item ||
    !quantity ||
    !unit ||
    !price
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields for update" });
  }

  const inventoryData = {
    date,
    created_by,
    invoice_no,
    item,
    quantity,
    unit,
    price,
    remarks,
    manufacturer_details,
  };

  inventoryModel.updateInventory(id, inventoryData, (error, results) => {
    if (error) {
      console.error("Error updating inventory:", error);
      return res.status(500).json({ error: "Error updating inventory" });
    } else if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Inventory item not found" });
    } else {
      res.status(200).json({ message: "Inventory item updated successfully" });
    }
  });
};

// Delete inventory item
export const deleteInventory = (req, res) => {
  const { id } = req.params;

  inventoryModel.deleteInventory(id, (error, results) => {
    if (error) {
      console.error("Error deleting inventory:", error);
      return res.status(500).json({ error: "Error deleting inventory" });
    } else if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Inventory item not found" });
    } else {
      res.status(200).json({ message: "Inventory item deleted successfully" });
    }
  });
};
