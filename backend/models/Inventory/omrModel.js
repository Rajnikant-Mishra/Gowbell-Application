import { db } from '../../config/db.js';

export const Omr = {
  create: (omrData, callback) => {
    const { title, quantity } = omrData;
    const query = 'INSERT INTO omr (title, quantity, created_at, updated_at) VALUES (?, ?,  NOW(), NOW())';
    db.query(query, [title, quantity], callback);
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM omr';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM omr WHERE id = ?';
    db.query(query, [id], callback);
  },

  update: (id, omrData, callback) => {
    const { title, quantity} = omrData;
    const query = 'UPDATE omr SET title = ?, quantity = ?, updated_at = NOW() WHERE id = ?';
    
    db.query(query, [title, quantity, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM omr WHERE id = ?';
    db.query(query, [id], callback);
  }
};

export default Omr;
