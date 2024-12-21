import { db } from '../../config/db.js';

export const City = {
  create: (name, country_id, state_id, district_id, status, callback) => {
    // First, check if the city already exists in the database
    db.query(
      'SELECT * FROM cities WHERE name = ? AND country_id = ? AND state_id = ? AND district_id = ?',
      [name, country_id, state_id, district_id],
      (err, result) => {
        if (err) {
          console.error('Error checking for duplicate city:', err);
          return callback(err, null);
        }

        // If a city already exists with the same name, country_id, state_id, and district_id
        if (result.length > 0) {
          return callback(new Error('City already exists'), null);
        }

        // If no duplicate, proceed with the insert
        db.query(
          'INSERT INTO cities (name, country_id, state_id, district_id, status) VALUES (?, ?, ?, ?, ?)',
          [name, country_id, state_id, district_id, status],
          callback
        );
      }
    );
  },

  getAll: (callback) => {
    db.query('SELECT * FROM cities', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM cities WHERE id = ?', [id], callback);
  },

  update: (id, name, country_id, state_id, district_id, status, callback) => {
    // Check for duplicate city before updating
    db.query(
      'SELECT * FROM cities WHERE name = ? AND country_id = ? AND state_id = ? AND district_id = ? AND id != ?',
      [name, country_id, state_id, district_id, id],
      (err, result) => {
        if (err) {
          console.error('Error checking for duplicate city during update:', err);
          return callback(err, null);
        }

        // If a city already exists with the same name, country_id, state_id, and district_id
        if (result.length > 0) {
          return callback(new Error('City already exists'), null);
        }

        // If no duplicate, proceed with the update
        db.query(
          'UPDATE cities SET name = ?, country_id = ?, state_id = ?, district_id = ?, status = ? WHERE id = ?',
          [name, country_id, state_id, district_id, status, id],
          callback
        );
      }
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM cities WHERE id = ?', [id], callback);
  },
};
