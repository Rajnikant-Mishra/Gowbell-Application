import { db } from '../../config/db.js';

export const Affiliated = {
    create: (name, status, callback) => {
        const sql = 'INSERT INTO affiliated (name, status, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
        db.query(sql, [name, status], callback);
    },

    findAll: (callback) => {
        const sql = 'SELECT * FROM affiliated';
        db.query(sql, callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM affiliated WHERE id = ?';
        db.query(sql, [id], callback);
    },

    update: (id, name, status, callback) => {
        const sql = 'UPDATE affiliated SET name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        db.query(sql, [name, status, id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM affiliated WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

export default Affiliated;