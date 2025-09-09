import inventoryModel from "../../models/Inventory/inventoryModel.js";

// Create a new inventory item
// export const createInventory = (req, res) => {
//   const {
//     date,
//     invoice_no,
//     item,
//     sub_item,
//     sub_item_name,
//     quantity,
//     unit,
//     price,
//     remarks,
//     manufacturer_details,
//   } = req.body;
//   const created_by = req.user.id;

//   if (!date || !invoice_no || !item || !quantity || !unit || !price) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const inventoryData = {
//     date,
//     created_by,
//     invoice_no,
//     item,
//     sub_item,
//     sub_item_name,
//     quantity,
//     unit,
//     price,
//     remarks,
//     manufacturer_details,
//   };

//   inventoryModel.createInventory(inventoryData, (error, results) => {
//     if (error) {
//       console.error("Error creating inventory:", error);
//       return res.status(500).json({ error: "Error creating inventory" });
//     }
//     res
//       .status(201)
//       .json({ message: "Inventory item created successfully", results });
//   });
// };

export const createInventory = (req, res) => {
  const {
    date,
    invoice_no,
    item,
    sub_item,
    sub_item_name,
    quantity,
    unit,
    price,
    remarks,
    manufacturer_details,
    session_id, // optional from frontend
  } = req.body;

  const created_by = req.user.id;

  if (!date || !invoice_no || !item || !quantity || !unit || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const inventoryData = {
    date,
    created_by,
    invoice_no,
    item,
    sub_item,
    sub_item_name,
    quantity,
    unit,
    price,
    remarks,
    manufacturer_details,
    session_id, // pass directly to model
  };

  inventoryModel.createInventory(inventoryData, (error, result) => {
    if (error) {
      console.error("Error creating inventory:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(result);
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

//paginate and get all sercch
// export const getInventorypaginate = (req, res) => {
//   const { page = 1, limit = 10, search = "" } = req.query;

//   inventoryModel.getInventoryWithPagination(parseInt(page), parseInt(limit), search, (error, data) => {
//     if (error) {
//       console.error("Error fetching inventory:", error);
//       return res.status(500).json({ error: "Error fetching inventory" });
//     }
//     res.status(200).json(data);
//   });
// };

export const getInventorypaginate = (req, res) => {
  const { page = 1, limit = 10, search = "", session_id = null } = req.query;

  inventoryModel.getInventoryWithPagination(
    parseInt(page),
    parseInt(limit),
    search,
    session_id,
    (error, data) => {
      if (error) {
        console.error("Error fetching inventory:", error);
        return res.status(500).json({
          error: "Error fetching inventory",
          details: error.message,
        });
      }
      res.status(200).json({ session_id: session_id || "active", ...data });
    }
  );
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
// export const updateInventory = (req, res) => {
//   const { id } = req.params;
//   const {
//     date,
//     created_by,
//     invoice_no,
//     item,
//     sub_item,
//     sub_item_name,
//     quantity,
//     unit,
//     price,
//     remarks,
//     manufacturer_details,
//   } = req.body;

//   if (
//     !date ||
//     !created_by ||
//     !invoice_no ||
//     !item ||
//     !quantity ||
//     !unit ||
//     !price
//   ) {
//     return res
//       .status(400)
//       .json({ error: "Missing required fields for update" });
//   }

//   const inventoryData = {
//     date,
//     created_by,
//     invoice_no,
//     item,
//     sub_item,
//     sub_item_name,
//     quantity,
//     unit,
//     price,
//     remarks,
//     manufacturer_details,
//   };

//   inventoryModel.updateInventory(id, inventoryData, (error, results) => {
//     if (error) {
//       console.error("Error updating inventory:", error);
//       return res.status(500).json({ error: "Error updating inventory" });
//     } else if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "Inventory item not found" });
//     } else {
//       res.status(200).json({ message: "Inventory item updated successfully" });
//     }
//   });
// };

export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const {
    date,
    invoice_no,
    item,
    sub_item,
    sub_item_name,
    quantity,
    unit,
    price,
    remarks,
    manufacturer_details,
  } = req.body;

  const created_by = req.user?.id;

  // Validate required fields
  if (
    !date ||
    !invoice_no ||
    !quantity ||
    !unit ||
    !price
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields for update" });
  }

  // Validate data types
  if (isNaN(quantity) || isNaN(price)) {
    return res
      .status(400)
      .json({ error: "Quantity and price must be numbers" });
  }

  const inventoryData = {
    date,
    invoice_no,
    item,
    sub_item,
    sub_item_name,
    quantity: parseFloat(quantity),
    unit,
    price: parseFloat(price),
    remarks,
    manufacturer_details,
  };

  try {
    const result = await new Promise((resolve, reject) => {
      inventoryModel.updateInventory(id, inventoryData, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating inventory:", error);
    if (error.message === "Inventory item not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error updating inventory" });
  }
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
