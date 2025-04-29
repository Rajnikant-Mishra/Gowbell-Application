import { db } from "../../config/db.js";

const Subitem = {
  getAll: (callback) => {
    db.query("SELECT * FROM subitems", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM subitems WHERE id = ?", [id], callback);
  },

  create: (data, callback) => {
    const { item_id, name, created_by, updated_by } = data;
    db.query(
      "INSERT INTO subitems (item_id, name, created_by, updated_by) VALUES (?, ?, ?, ?)",
      [item_id, name, created_by, updated_by],
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
  }
  
  
};

export default Subitem;
