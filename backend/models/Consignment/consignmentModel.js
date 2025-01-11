import { db } from '../../config/db.js';

const Consignment = {
    create: (data, callback) => {
        const query = `
            INSERT INTO consignments (
                consignment_id, date, created_by, school_name, via, vehicle_number, 
                driver_name, driver_contact_number, tracking_number, courier_company, 
                delivery_date, postal_tracking_number, postal_name, postal_delivery_date, 
                goodies, remarks
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            data.consignment_id, data.date, data.created_by, data.school_name, data.via,
            data.vehicle_number, data.driver_name, data.driver_contact_number,
            data.tracking_number, data.courier_company, data.delivery_date,
            data.postal_tracking_number, data.postal_name, data.postal_delivery_date,
            JSON.stringify(data.goodies || null), data.remarks
        ];
        db.query(query, values, callback);
    },

    findAll: (callback) => {
        const query = `SELECT * FROM consignments ORDER BY created_at DESC`;
        db.query(query, callback);
    },

    findById: (id, callback) => {
        const query = `SELECT * FROM consignments WHERE id = ?`;
        db.query(query, [id], callback);
    },

    update: (id, data, callback) => {
        const query = `
            UPDATE consignments SET 
                consignment_id = ?, date = ?, created_by = ?, school_name = ?, via = ?,
                vehicle_number = ?, driver_name = ?, driver_contact_number = ?, 
                tracking_number = ?, courier_company = ?, delivery_date = ?, 
                postal_tracking_number = ?, postal_name = ?, postal_delivery_date = ?, 
                goodies = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`;
        const values = [
            data.consignment_id, data.date, data.created_by, data.school_name, data.via,
            data.vehicle_number, data.driver_name, data.driver_contact_number,
            data.tracking_number, data.courier_company, data.delivery_date,
            data.postal_tracking_number, data.postal_name, data.postal_delivery_date,
            JSON.stringify(data.goodies || null), data.remarks, id
        ];
        db.query(query, values, callback);
    },

    delete: (id, callback) => {
        const query = `DELETE FROM consignments WHERE id = ?`;
        db.query(query, [id], callback);
    }
};

export default Consignment;
