import { db } from '../../config/db.js';

export const Area = {
  create: (name, country_id, state_id, district_id, city_id, status, callback) => {
    db.query(
      'INSERT INTO areas (name, country_id, state_id, district_id, city_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, country_id, state_id, district_id, city_id, status],
      callback
    );
  },

  // Check if an area with the same name and IDs already exists (excluding the current area id)
  checkDuplicate: (name, country_id, state_id, district_id, city_id, callback) => {
    db.query(
      'SELECT * FROM areas WHERE name = ? AND country_id = ? AND state_id = ? AND district_id = ? AND city_id = ?',
      [name, country_id, state_id, district_id, city_id],
      callback
    );
  },

  // Check if an area with the same name and IDs already exists (for update, excluding the current area id)
  checkDuplicateForUpdate: (name, country_id, state_id, district_id, city_id, id, callback) => {
    db.query(
      'SELECT * FROM areas WHERE name = ? AND country_id = ? AND state_id = ? AND district_id = ? AND city_id = ? AND id != ?',
      [name, country_id, state_id, district_id, city_id, id],
      callback
    );
  },

  getAll: (callback) => {
    db.query('SELECT * FROM areas', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM areas WHERE id = ?', [id], callback);
  },

  update: (id, name, country_id, state_id, district_id, city_id, status, callback) => {
    db.query(
      'UPDATE areas SET name = ?, country_id = ?, state_id = ?, district_id = ?, city_id = ?, status = ? WHERE id = ?',
      [name, country_id, state_id, district_id, city_id, status, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM areas WHERE id = ?', [id], callback);
  },
};
