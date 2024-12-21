import { db } from '../../config/db.js';

export const Class = {
    create: (name, status, callback) => {
        const sql = 'INSERT INTO class (name, status) VALUES (?, ?)';
        db.query(sql, [name, status], callback);
    },

    findAll: (callback) => {
        const sql = 'SELECT * FROM class';
        db.query(sql, callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM class WHERE id = ?';
        db.query(sql, [id], callback);
    },

    update: (id, name, status, callback) => {
        const sql = 'UPDATE class SET name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        db.query(sql, [name, status, id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM class WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

export default Class;
