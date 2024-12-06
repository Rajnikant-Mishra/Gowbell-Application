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
    const query = 'UPDATE districts SET name = ?, country_id = ?, state_id = ?, status = ? WHERE id = ?';
    db.query(query, [name, country_id, state_id, status, id], (err, result) => {
      if (err) {
        console.error('Error updating district:', err); // Log error on the server side
        return callback(err, null);
      }
      if (result.affectedRows === 0) {
        return callback(new Error('District not found'), null); // Handle case where no rows were updated
      }
      callback(null, result);
    });
  },

  delete: (id, callback) => {
    db.query('DELETE FROM districts WHERE id = ?', [id], callback);
  },
};


