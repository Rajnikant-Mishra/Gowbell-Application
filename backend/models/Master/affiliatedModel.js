import { db } from '../../config/db.js';

export const Affiliated = {
    create: (name, status, callback) => {
        // Check if the name already exists
        const checkSql = 'SELECT * FROM affiliated WHERE name = ?';
        db.query(checkSql, [name], (err, result) => {
            if (err) return callback(err, null);

            if (result.length > 0) {
                // Name already exists, prevent creation
                return callback(new Error('Affiliated entry with this name already exists'), null);
            }

            // Proceed to insert if no duplicate found
            const sql = 'INSERT INTO affiliated (name, status, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
            db.query(sql, [name, status], callback);
        });
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
        // Check if the name already exists for another record (excluding the current ID)
        const checkSql = 'SELECT * FROM affiliated WHERE name = ? AND id != ?';
        db.query(checkSql, [name, id], (err, result) => {
            if (err) return callback(err, null);

            if (result.length > 0) {
                // Name already exists, prevent update
                return callback(new Error('Affiliated entry with this name already exists'), null);
            }

            // Proceed to update if no duplicate found
            const sql = 'UPDATE affiliated SET name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.query(sql, [name, status, id], callback);
        });
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM affiliated WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

export default Affiliated;
