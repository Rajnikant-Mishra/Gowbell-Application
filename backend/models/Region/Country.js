// models/Country.js
import { db } from '../../config/db.js';

export const Country = {
  create: (name, status, callback) => {
    db.query('INSERT INTO countries (name, status) VALUES (?, ?)', [name, status], callback);
  },
  getAll: (callback) => {
    db.query('SELECT * FROM countries', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM countries WHERE id = ?', [id], callback);
  },
  update: (id, name, status, callback) => {
    db.query('UPDATE countries SET name = ?, status = ? WHERE id = ?', [name, status, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM countries WHERE id = ?', [id], callback);
  },
};
