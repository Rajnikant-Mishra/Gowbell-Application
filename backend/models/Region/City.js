// models/City.js
import { db } from '../../config/db.js';

export const City = {
  create: (name, country_id, state_id, district_id, status, callback) => {
    db.query(
      'INSERT INTO cities (name, country_id, state_id, district_id, status) VALUES (?, ?, ?, ?, ?)',
      [name, country_id, state_id, district_id, status],
      callback
    );
  },
  getAll: (callback) => {
    db.query('SELECT * FROM cities', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM cities WHERE id = ?', [id], callback);
  },
  update: (id, name, country_id, state_id, district_id, status, callback) => {
    db.query(
      'UPDATE cities SET name = ?, country_id = ?, state_id = ?, district_id = ?, status = ? WHERE id = ?',
      [name, country_id, state_id, district_id, status, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.query('DELETE FROM cities WHERE id = ?', [id], callback);
  },
};

