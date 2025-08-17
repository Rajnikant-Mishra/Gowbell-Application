import { db } from "../../config/db.js";

const Subitem = {
  getAll: (callback) => {
    db.query("SELECT * FROM subitems", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM subitems WHERE id = ?", [id], callback);
  },

  create: (data, callback) => {
    const { item_id, name, parent_id } = data;
    db.query(
      "INSERT INTO subitems (item_id, name, parent_id) VALUES (?, ?, ?)",
      [item_id, name, parent_id || null],
      callback
    );
  },

  update: (id, data, callback) => {
    const { item_id, name, updated_by } = data;
    db.query(
      "UPDATE subitems SET item_id = ?, name = ?, updated_by = ? WHERE id = ?",
      [item_id, name, updated_by, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM subitems WHERE id = ?", [id], callback);
  },

  getSubitemsByItemId: (itemId, callback) => {
    const query = `
      SELECT id, name, item_id 
      FROM subitems 
      WHERE item_id = ?
    `;
    db.query(query, [itemId], callback);
  },



  getNames: (parent_id, item_id, callback) => {
    if (parent_id) {
      db.query(
        "SELECT name FROM subitems WHERE parent_id = ?",
        [parent_id],
        callback
      );
    } else if (item_id) {
      const query = `
      SELECT p.id AS parent_id, p.name AS parent_name
      FROM subitems AS s
      LEFT JOIN subitems AS p ON s.parent_id = p.id
      WHERE s.item_id = ?
    `;
      db.query(query, [item_id], callback);
    } else {
      callback(new Error("No valid parameter provided"), null);
    }
  },
};

export default Subitem;
