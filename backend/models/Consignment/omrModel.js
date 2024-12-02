import { db } from '../../config/db.js';

export const Omr = {
    create: (studentData, callback) => {
        const { school_name, class_from, class_to, omr } = studentData;
        const query = `
            INSERT INTO omrco 
            (school_name, class_from, class_to, omr, created_at, updated_at) 
            VALUES (?, ?, ?, ?, NOW(), NOW())`;
        db.query(query, [school_name, class_from, class_to, omr], callback);
    },

    getAll: (callback) => {
        const query = 'SELECT * FROM omrco';
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = 'SELECT * FROM omrco WHERE id = ?';
        db.query(query, [id], callback);
    },

    update: (id, studentData, callback) => {
        const { school_name, class_from, class_to, omr } = studentData;
        const query = `
            UPDATE omrco 
            SET school_name = ?, class_from = ?, class_to = ?, omr = ?, updated_at = NOW() 
            WHERE id = ?`;
        db.query(query, [school_name, class_from, class_to, omr, id], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM omrco WHERE id = ?';
        db.query(query, [id], callback);
    }

    
};

export default Omr;
