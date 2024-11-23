import { db } from '../../config/db.js';

export const Incharge = {
    create: (inchargeData, callback) => {
        const { school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to } = inchargeData;
        const query = `
            INSERT INTO incharge 
            (school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        db.query(query, [school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to], callback);
    },

    getAll: (callback) => {
        const query = 'SELECT * FROM incharge';
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = 'SELECT * FROM incharge WHERE id = ?';
        db.query(query, [id], callback);
    },

    update: (id, inchargeData, callback) => {
        const { school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to } = inchargeData;
        const query = `
            UPDATE incharge
            SET school_name = ?, incharge_name = ?, incharge_dob = ?, mobile_number = ?, class_from = ?, class_to = ?, updated_at = NOW()
            WHERE id = ?
        `;
        db.query(query, [school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to, id], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM incharge WHERE id = ?';
        db.query(query, [id], callback);
    }
};


export default Incharge;
