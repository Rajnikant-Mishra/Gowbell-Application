// models/State.js
import { db } from '../../config/db.js';

export const State = {
  create: (name, status, country_id, callback) => {
    db.query(
      'INSERT INTO states (name, status, country_id) VALUES (?, ?, ?)',
      [name, status, country_id],
      callback
    );
  },

  getAll: (callback) => {
    db.query('SELECT * FROM states', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM states WHERE id = ?', [id], callback);
  },

  update: (id, name, status, country_id, callback) => {
    db.query(
      'UPDATE states SET name = ?, status = ?, country_id = ? WHERE id = ?',
      [name, status, country_id, id],
      callback
    );
  },
  
  delete: (id, callback) => {
    db.query('DELETE FROM states WHERE id = ?', [id], callback);
  },
};


