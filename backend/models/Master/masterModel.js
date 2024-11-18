import { db } from '../../config/db.js';

export const Master = {
    create: (name, status, callback) => {
        const sql = 'INSERT INTO master (name, status) VALUES (?, ?)';
        db.query(sql, [name, status], callback);
    },

    findAll: (callback) => {
        const sql = 'SELECT * FROM master';
        db.query(sql, callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM master WHERE id = ?';
        db.query(sql, [id], callback);
    },

    update: (id, name, status, callback) => {
        const sql = 'UPDATE master SET name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        db.query(sql, [name, status, id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM master WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

export default Master;
