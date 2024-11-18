// models/Area.jsimport { db } from '../../config/db.js';
import { db } from '../../config/db.js';


export const Area = {
  create: (name, country_id, state_id, district_id, city_id, status, callback) => {
    db.query(
      'INSERT INTO areas (name, country_id, state_id, district_id, city_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, country_id, state_id, district_id, city_id, status],
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


