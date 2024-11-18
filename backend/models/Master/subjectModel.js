import { db } from '../../config/db.js';

export const  Subject = {
    create: (name, status, callback) => {
        const sql = 'INSERT INTO subject_master (name, status) VALUES (?, ?)';
        db.query(sql, [name, status], callback);
    },

    findAll: (callback) => {
        const sql = 'SELECT * FROM subject_master';
        db.query(sql, callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM subject_master WHERE id = ?';
        db.query(sql, [id], callback);
    },

    update: (id, name, status, callback) => {
        const sql = 'UPDATE subject_master SET name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        db.query(sql, [name, status, id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM subject_master WHERE id = ?';
        db.query(sql, [id], callback);
    }
};


