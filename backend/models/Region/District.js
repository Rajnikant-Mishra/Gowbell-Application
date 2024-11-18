// models/District.js
import { db } from '../../config/db.js';

export const District = {
  create: (name, country_id, state_id, status, callback) => {
    db.query(
      'INSERT INTO districts (name, country_id, state_id, status) VALUES (?, ?, ?, ?)',
      [name, country_id, state_id, status],
      callback
    );
  },
  getAll: (callback) => {
    db.query('SELECT * FROM districts', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM districts WHERE id = ?', [id], callback);
  },
  update: (id, name, country_id, state_id, status, callback) => {
    db.query(
      'UPDATE districts SET name = ?, country_id = ?, state_id = ?, status = ? WHERE id = ?',
      [name, country_id, state_id, status, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.query('DELETE FROM districts WHERE id = ?', [id], callback);
  },
};


