import { db } from "../../config/db.js";

const inventoryModel = {
  // Create a new inventory item
  // createInventory: (inventoryData, callback) => {
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
  //   } = inventoryData;

  //   if (!date || !invoice_no || !item || !quantity || !unit || !price) {
  //     return callback(new Error("Missing required fields"), null);
  //   }

  //   const query = `INSERT INTO inventory (date, created_by, invoice_no, item, sub_item, sub_item_name, quantity, unit, price, remarks, manufacturer_details)
  //                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  //   db.query(
  //     query,
  //     [
  //       date,
  //       created_by,
  //       invoice_no,
  //       item,
  //       sub_item,
  //       sub_item_name,
  //       quantity,
  //       unit,
  //       price,
  //       remarks,
  //       manufacturer_details,
  //     ],
  //     (error, results) => {
  //       if (error) {
  //         callback(error, null);
  //       } else {
  //         callback(null, results);
  //       }
  //     }
  //   );
  // },

  // createInventory: (inventoryData, callback) => {
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
  //   } = inventoryData;

  //   if (!date || !invoice_no || !item || !quantity || !unit || !price) {
  //     return callback(new Error("Missing required fields"), null);
  //   }

  //   // Step 1: Get active session_id
  //   const sessionQuery = `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`;

  //   db.query(sessionQuery, (sessionError, sessionResults) => {
  //     if (sessionError) {
  //       return callback(sessionError, null);
  //     }
  //     if (sessionResults.length === 0) {
  //       return callback(new Error("No active session found"), null);
  //     }

  //     const session_id = sessionResults[0].id;

  //     // Step 2: Insert inventory with session_id
  //     const insertQuery = `
  //     INSERT INTO inventory
  //       (session_id, date, created_by, invoice_no, item, sub_item, sub_item_name, quantity, unit, price, remarks, manufacturer_details)
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //   `;

  //     db.query(
  //       insertQuery,
  //       [
  //         session_id,
  //         date,
  //         created_by,
  //         invoice_no,
  //         item,
  //         sub_item,
  //         sub_item_name,
  //         quantity,
  //         unit,
  //         price,
  //         remarks,
  //         manufacturer_details,
  //       ],
  //       (error, results) => {
  //         if (error) {
  //           callback(error, null);
  //         } else {
  //           callback(null, results);
  //         }
  //       }
  //     );
  //   });
  // },

  createInventory: (inventoryData, callback) => {
    const {
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
      session_id, // optional
    } = inventoryData;

    if (!date || !invoice_no || !item || !quantity || !unit || !price) {
      return callback(new Error("Missing required fields"), null);
    }

    // Step 1: Resolve session_id dynamically
    const resolveSessionId = (next) => {
      if (session_id) {
        const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
        db.query(verifyQuery, [session_id], (err, result) => {
          if (err) return callback(err, null);
          if (result.length === 0)
            return callback(new Error("Invalid session ID selected"), null);
          return next(session_id);
        });
      } else {
        const sessionQuery = `
          SELECT id FROM gowvell_session 
          WHERE status = 'active' 
          ORDER BY id DESC LIMIT 1
        `;
        db.query(sessionQuery, (err, result) => {
          if (err) return callback(err, null);
          if (result.length === 0)
            return callback(new Error("No active session found"), null);
          return next(result[0].id);
        });
      }
    };

    // Step 2: Insert inventory using resolved session_id
    resolveSessionId((finalSessionId) => {
      const insertQuery = `
        INSERT INTO inventory 
          (session_id, date, created_by, invoice_no, item, sub_item, sub_item_name, quantity, unit, price, remarks, manufacturer_details) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [
          finalSessionId,
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
        ],
        (error, results) => {
          if (error) return callback(error, null);
          callback(null, {
            message: "Inventory item created successfully",
            id: results.insertId,
          });
        }
      );
    });
  },

  // Get all inventory items
  getInventory: (callback) => {
    const query = "SELECT * FROM inventory ORDER BY created_at DESC";
    db.query(query, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  },

  //paginate seracg and get all
  // getInventoryWithPagination: (page = 1, limit = 10, search = "", callback) => {
  //   const offset = (page - 1) * limit;
  //   let whereClause = "";
  //   let queryParams = [];

  //   // Adjust column names to what exists in your `inventory` table
  //   if (search && search.trim() !== "") {
  //     whereClause = `
  //     WHERE
  //       item_name LIKE ? OR
  //       category LIKE ? OR
  //       status LIKE ? OR
  //       location LIKE ?
  //   `;
  //     for (let i = 0; i < 4; i++) queryParams.push(`%${search}%`);
  //   }

  //   const dataQuery = `
  //   SELECT *
  //   FROM inventory
  //   ${whereClause}
  //   ORDER BY created_at DESC
  //   LIMIT ? OFFSET ?;
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) AS total
  //   FROM inventory
  //   ${whereClause};
  // `;

  //   db.query(countQuery, queryParams, (err, countResult) => {
  //     if (err) return callback(err);

  //     const totalRecords = countResult[0].total;
  //     const totalPages = Math.ceil(totalRecords / limit);
  //     const nextPage = page < totalPages ? page + 1 : null;
  //     const prevPage = page > 1 ? page - 1 : null;

  //     db.query(
  //       dataQuery,
  //       [...queryParams, parseInt(limit), parseInt(offset)],
  //       (err, results) => {
  //         if (err) return callback(err);

  //         callback(null, {
  //           inventory: results,
  //           currentPage: page,
  //           nextPage,
  //           prevPage,
  //           totalPages,
  //           totalRecords,
  //         });
  //       }
  //     );
  //   });
  // },

  getInventoryWithPagination: (
    page = 1,
    limit = 10,
    search = "",
    session_id = null,
    callback
  ) => {
    const offset = (page - 1) * limit;
    let whereClause = "";
    let queryParams = [];

    // --- Session filter ---
    if (session_id) {
      whereClause = "WHERE i.session_id = ?";
      queryParams.push(session_id);
    } else {
      whereClause = "WHERE gs.status = 'active'";
    }

    // --- Search filter ---
    if (search && search.trim() !== "") {
      whereClause += ` AND (
      i.item_name LIKE ? OR 
      i.category LIKE ? OR 
      i.status LIKE ? OR 
      i.location LIKE ?
    )`;
      for (let i = 0; i < 4; i++) queryParams.push(`%${search}%`);
    }

    const dataQuery = `
    SELECT i.*, gs.session 
    FROM inventory i
    JOIN gowvell_session gs ON i.session_id = gs.id
    ${whereClause}
    ORDER BY i.created_at DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total 
    FROM inventory i
    JOIN gowvell_session gs ON i.session_id = gs.id
    ${whereClause};
  `;

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      db.query(
        dataQuery,
        [...queryParams, parseInt(limit), parseInt(offset)],
        (err, results) => {
          if (err) return callback(err);

          callback(null, {
            inventory: results,
            currentPage: page,
            nextPage,
            prevPage,
            totalPages,
            totalRecords,
          });
        }
      );
    });
  },

  // Get inventory item by ID
  getInventoryById: (id, callback) => {
    const query = "SELECT * FROM inventory WHERE id = ?";
    db.query(query, [id], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results.length > 0 ? results[0] : null);
      }
    });
  },

  // Update inventory item
  // updateInventory: (id, inventoryData, callback) => {
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
  //   } = inventoryData;

  //   const query = `UPDATE inventory
  //                SET date = ?, created_by = ?, invoice_no = ?, item = ?, sub_item = ?, sub_item_name = ?,
  //                    quantity = ?, unit = ?, price = ?, remarks = ?, manufacturer_details = ?
  //                WHERE id = ?`;

  //   const values = [
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
  //     id,
  //   ];

  //   db.query(query, values, (error, results) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       callback(null, results);
  //     }
  //   });
  // },

  updateInventory: (id, inventoryData, callback) => {
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
    } = inventoryData;

    // Validate required fields
    if (
      !date ||
      !invoice_no ||
      !quantity ||
      !unit ||
      !price
    ) {
      return callback(new Error("Missing required fields"), null);
    }

    // Validate data types
    if (isNaN(quantity) || isNaN(price)) {
      return callback(new Error("Quantity and price must be numbers"), null);
    }

    const query = `
    UPDATE inventory 
    SET date = ?,  invoice_no = ?, item = ?, sub_item = ?, sub_item_name = ?, 
        quantity = ?, unit = ?, price = ?, remarks = ?, manufacturer_details = ?
    WHERE id = ?
  `;

    const values = [
      new Date(date).toISOString().split("T")[0], // Normalize date format

      invoice_no,
      item,
      sub_item || null,
      sub_item_name || null,
      parseFloat(quantity),
      unit,
      parseFloat(price),
      remarks || null,
      manufacturer_details || null,
      id,
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        return callback(new Error("Database error updating inventory"), null);
      }
      if (results.affectedRows === 0) {
        return callback(new Error("Inventory item not found"), null);
      }
      callback(null, { message: "Inventory item updated successfully" });
    });
  },

  // Delete inventory item
  deleteInventory: (id, callback) => {
    const query = "DELETE FROM inventory WHERE id = ?";
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
