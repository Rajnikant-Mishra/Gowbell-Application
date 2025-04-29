import { db } from "../../config/db.js";

const Item = {
  getAll: (callback) => {
    db.query('SELECT * FROM items', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM items WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO items (name, created_by, updated_by) VALUES (?, ?, ?)', 
      [data.name, data.created_by, data.updated_by], callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE items SET name = ?, updated_by = ? WHERE id = ?', 
      [data.name, data.updated_by, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM items WHERE id = ?', [id], callback);
  },
};

export default Item;
