import Consignment from "../../models/Consignment/consignmentModel.js";
import { db } from "../../config/db.js";

// export const createConsignment = (req, res) => {
//   const data = req.body;

//   // Auto-generate created_by from logged-in user
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ error: "Unauthorized: User ID not found" });
//   }
//   data.created_by = req.user.id; // Set created_by from logged-in user

//   // Ensure date is valid or set to NULL
//   data.date = data.date || null;
//   data.delivery_date = data.delivery_date || null;
//   data.postal_delivery_date = data.postal_delivery_date || null;

//   // Validate date formats
//   const isValidDate = (date) => !date || !isNaN(new Date(date).getTime());
//   if (
//     !isValidDate(data.date) ||
//     !isValidDate(data.delivery_date) ||
//     !isValidDate(data.postal_delivery_date)
//   ) {
//     return res.status(400).json({ error: "Invalid date format" });
//   }

//   // Insert into database
//   Consignment.create(data, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res
//       .status(201)
//       .json({ message: "Consignment created successfully", results });
//   });
// };

// export const createConsignment = (req, res) => {
//   const data = req.body;

//   // Set created_by from logged-in user
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ error: "Unauthorized: User ID not found" });
//   }
//   data.created_by = req.user.id;

//   // Ensure valid dates
//   data.date = data.date || null;
//   data.delivery_date = data.delivery_date || null;
//   data.postal_delivery_date = data.postal_delivery_date || null;

//   const isValidDate = (date) => !date || !isNaN(new Date(date).getTime());
//   if (
//     !isValidDate(data.date) ||
//     !isValidDate(data.delivery_date) ||
//     !isValidDate(data.postal_delivery_date)
//   ) {
//     return res.status(400).json({ error: "Invalid date format" });
//   }

//   const goodies = data.goodies || [];
//   if (!goodies.length)
//     return res.status(400).json({ error: "No goodies provided" });

//   // Step 1: Check inventory for each goodie
//   const checkInventory = (index = 0) => {
//     if (index >= goodies.length) return insertConsignment();

//     const item = goodies[index];
//     const query = `SELECT quantity FROM inventory WHERE id = ?`;
//     db.query(query, [item.inventory_id], (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!results.length)
//         return res
//           .status(400)
//           .json({ error: `Inventory ID ${item.inventory_id} not found` });
//       if (results[0].quantity < item.quantity)
//         return res.status(400).json({
//           error: `Insufficient stock for ${item.item} - ${item.sub_item} - ${item.sub_item_name}`,
//         });
//       checkInventory(index + 1);
//     });
//   };

//   // Step 2: Insert consignment
//   const insertConsignment = () => {
//     Consignment.create(data, (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       updateInventory(0, results.insertId);
//     });
//   };

//   // Step 3: Deduct inventory
//   const updateInventory = (index, consignmentId) => {
//     if (index >= goodies.length)
//       return res.status(201).json({
//         message: "Consignment created successfully, inventory updated",
//         consignmentId,
//       });

//     const item = goodies[index];
//     const query = `UPDATE inventory SET quantity = quantity - ? WHERE id = ?`;
//     db.query(query, [item.quantity, item.inventory_id], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       updateInventory(index + 1, consignmentId);
//     });
//   };

//   // Start the process
//   checkInventory();
// };

export const createConsignment = (req, res) => {
  const data = req.body;

  // ✅ Step 0: Auth check
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized: User ID not found" });
  }
  data.created_by = req.user.id;

  // ✅ Step 1: Date handling
  const isValidDate = (date) => !date || !isNaN(new Date(date).getTime());
  data.date = data.date || null;
  data.delivery_date = data.delivery_date || null;
  data.postal_delivery_date = data.postal_delivery_date || null;

  if (
    !isValidDate(data.date) ||
    !isValidDate(data.delivery_date) ||
    !isValidDate(data.postal_delivery_date)
  ) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  // ✅ Step 2: Goodies validation
  const goodies = data.goodies || [];
  if (!Array.isArray(goodies) || goodies.length === 0) {
    return res.status(400).json({ error: "No goodies provided" });
  }

  // ✅ Step 3: Validate each goodie has required fields
  for (const goodie of goodies) {
    if (!goodie.inventory_id || !goodie.quantity || goodie.quantity <= 0) {
      return res.status(400).json({
        error: `Each goodie must include a valid inventory_id and positive quantity.`,
      });
    }
  }

  // ✅ Step 4: Check all inventories first before inserting anything
  const inventoryIds = goodies.map((g) => g.inventory_id);
  const query = `SELECT id, item, sub_item, sub_item_name, quantity FROM inventory WHERE id IN (?)`;

  db.query(query, [inventoryIds], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Check if any inventory items missing
    const foundIds = results.map((r) => r.id);
    const missingIds = inventoryIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length > 0) {
      return res.status(400).json({
        error: `Inventory items not found: ${missingIds.join(", ")}`,
      });
    }

    // ✅ Check stock for each goodie
    for (const goodie of goodies) {
      const match = results.find((r) => r.id === goodie.inventory_id);
      if (!match) {
        return res
          .status(400)
          .json({ error: `Inventory ID ${goodie.inventory_id} not found` });
      }

      if (goodie.quantity > match.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${match.item} - ${match.sub_item} - ${match.sub_item_name}". 
                  Available: ${match.quantity}, Requested: ${goodie.quantity}`,
        });
      }
    }

    // ✅ Step 5: Passed all validations → Insert consignment
    Consignment.create(data, (err, results2) => {
      if (err) return res.status(500).json({ error: err.message });
      const consignmentId = results2.insertId;

      // ✅ Step 6: Deduct quantities in inventory
      const updateNext = (index = 0) => {
        if (index >= goodies.length) {
          return res.status(201).json({
            message: "Consignment created successfully, inventory updated",
            consignmentId,
          });
        }

        const g = goodies[index];
        const updateQuery = `UPDATE inventory SET quantity = quantity - ? WHERE id = ?`;
        db.query(updateQuery, [g.quantity, g.inventory_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          updateNext(index + 1);
        });
      };

      updateNext();
    });
  });
};

export const getAllConsignments = (req, res) => {
  Consignment.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

//paginate with serch get all
export const getAllConsignmentspaginate = (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  Consignment.findAllWithPagination(
    parseInt(page),
    parseInt(limit),
    search,
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(data);
    }
  );
};

export const getConsignmentById = (req, res) => {
  const { id } = req.params;
  Consignment.findById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(404).json({ message: "Consignment not found" });
    res.status(200).json(results[0]);
  });
};

// export const updateConsignment = (req, res) => {
//   const { id } = req.params;
//   const data = req.body;

//   // Ensure date is valid or set to NULL
//   data.date = data.date || null;
//   data.delivery_date = data.delivery_date || null;
//   data.postal_delivery_date = data.postal_delivery_date || null;

//   // Validate date formats
//   const isValidDate = (date) => !date || !isNaN(new Date(date).getTime());

//   if (
//     !isValidDate(data.date) ||
//     !isValidDate(data.delivery_date) ||
//     !isValidDate(data.postal_delivery_date)
//   ) {
//     return res.status(400).json({ error: "Invalid date format" });
//   }

//   Consignment.update(id, data, (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(200).json({ message: "Consignment updated successfully" });
//   });
// };



export const updateConsignment = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // ✅ Step 0: Auth check
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized: User ID not found" });
  }
  data.updated_by = req.user.id;

  // ✅ Step 1: Date handling
  const isValidDate = (date) => !date || !isNaN(new Date(date).getTime());
  data.date = data.date || null;
  data.delivery_date = data.delivery_date || null;
  data.postal_delivery_date = data.postal_delivery_date || null;

  if (
    !isValidDate(data.date) ||
    !isValidDate(data.delivery_date) ||
    !isValidDate(data.postal_delivery_date)
  ) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  // ✅ Step 2: Goodies validation
  const goodies = data.goodies || [];
  if (!Array.isArray(goodies) || goodies.length === 0) {
    return res.status(400).json({ error: "No goodies provided" });
  }

  // ✅ Step 3: Validate each goodie
  for (const goodie of goodies) {
    if (!goodie.inventory_id || !goodie.quantity || goodie.quantity <= 0) {
      return res.status(400).json({
        error: `Each goodie must include a valid inventory_id and positive quantity.`,
      });
    }
  }

  // ✅ Step 4: Check inventory availability before updating
  const inventoryIds = goodies.map((g) => g.inventory_id);
  const query = `SELECT id, item, sub_item, sub_item_name, quantity FROM inventory WHERE id IN (?)`;

  db.query(query, [inventoryIds], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const foundIds = results.map((r) => r.id);
    const missingIds = inventoryIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length > 0) {
      return res.status(400).json({
        error: `Inventory items not found: ${missingIds.join(", ")}`,
      });
    }

    // ✅ Step 5: Check stock for each item
    for (const goodie of goodies) {
      const match = results.find((r) => r.id === goodie.inventory_id);
      if (!match) {
        return res
          .status(400)
          .json({ error: `Inventory ID ${goodie.inventory_id} not found` });
      }

      if (goodie.quantity > match.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${match.item} - ${match.sub_item} - ${match.sub_item_name}". 
                  Available: ${match.quantity}, Requested: ${goodie.quantity}`,
        });
      }
    }

    // ✅ Step 6: Passed all validations → Update consignment
    Consignment.update(id, data, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // ✅ Step 7: Deduct inventory quantities (recalculate)
      const updateNext = (index = 0) => {
        if (index >= goodies.length) {
          return res.status(200).json({
            message: "Consignment updated successfully, inventory adjusted",
          });
        }

        const g = goodies[index];
        const updateQuery = `UPDATE inventory SET quantity = quantity - ? WHERE id = ?`;

        db.query(updateQuery, [g.quantity, g.inventory_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          updateNext(index + 1);
        });
      };

      updateNext();
    });
  });
};


export const deleteConsignment = (req, res) => {
  const { id } = req.params;
  Consignment.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Consignment deleted successfully" });
  });
};
