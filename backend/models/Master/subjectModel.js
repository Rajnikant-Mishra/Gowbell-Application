import { db } from '../../config/db.js';

export const Subject = {
    // CREATE - Add a new subject
    // create: (name, status, callback) => {
    //     // Check if the subject already exists
    //     const checkDuplicateSql = 'SELECT * FROM subject_master WHERE name = ?';
    //     db.query(checkDuplicateSql, [name], (err, result) => {
    //         if (err) {
    //             return callback(err, null);  // Error checking for duplicates
    //         }

    //         if (result.length > 0) {
    //             return callback('Subject already exists', null);  // Subject already exists
    //         }

    //         // Proceed to insert the new subject
    //         const sql = 'INSERT INTO subject_master (name, status) VALUES (?, ?)';
    //         db.query(sql, [name, status], callback);
    //     });
    // },

    create: (name, status, createdBy, callback) => {
        const checkDuplicateSql = 'SELECT * FROM subject_master WHERE name = ?';
        db.query(checkDuplicateSql, [name], (err, result) => {
            if (err) {
                return callback(err, null);
            }
    
            if (result.length > 0) {
                return callback('Subject already exists', null);
            }
    
            // Insert new subject with created_by
            const sql = 'INSERT INTO subject_master (name, status, created_by) VALUES (?, ?, ?)';
            db.query(sql, [name, status, createdBy], callback);
        });
    },
    

    // UPDATE - Update a subject by ID
    update: (id, name, status, callback) => {
        // Check if the subject name already exists for another subject
        const checkDuplicateSql = 'SELECT * FROM subject_master WHERE name = ? AND id != ?';
        db.query(checkDuplicateSql, [name, id], (err, result) => {
            if (err) {
                return callback(err, null);  // Error checking for duplicates
            }

            if (result.length > 0) {
                return callback('Subject with this name already exists', null);  // Duplicate subject name
            }

            // Proceed to update the subject
            const sql = 'UPDATE subject_master SET name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.query(sql, [name, status, id], callback);
        });
    },

    // READ - Get all subjects
    findAll: (callback) => {
        const sql = 'SELECT * FROM subject_master';
        db.query(sql, callback);
    },

    // READ - Get a specific subject by ID
    findById: (id, callback) => {
        const sql = 'SELECT * FROM subject_master WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // DELETE - Delete a subject by ID
    delete: (id, callback) => {
        const sql = 'DELETE FROM subject_master WHERE id = ?';
        db.query(sql, [id], callback);
    }
};




