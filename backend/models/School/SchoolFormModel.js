import { db } from '../../config/db.js';

const School = {
    

        getAll: (callback) => {
            const sql = 'SELECT * FROM school'; // Ensure correct SQL query
            db.query(sql, callback);
        },
   

    getById: (id, callback) => {
        const sql = 'SELECT * FROM school WHERE id = ?';
        db.query(sql, [id], callback);
    },
    create: (data, callback) => {
        const sql = 'INSERT INTO school SET ?';
        db.query(sql, data, callback);
    },
    update: (id, data, callback) => {
        const sql = 'UPDATE school SET ? WHERE id = ?';
        db.query(sql, [data, id], callback);
    },
    delete: (id, callback) => {
        const sql = 'DELETE FROM school WHERE id = ?';
        db.query(sql, [id], callback);
    },
};

export default School;
