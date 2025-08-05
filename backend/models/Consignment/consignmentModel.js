import { db } from "../../config/db.js";

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
      data.consignment_id,
      data.date,
      data.created_by,
      data.school_name,
      data.via,
      data.vehicle_number,
      data.driver_name,
      data.driver_contact_number,
      data.tracking_number,
      data.courier_company,
      data.delivery_date,
      data.postal_tracking_number,
      data.postal_name,
      data.postal_delivery_date,
      JSON.stringify(data.goodies || null),
      data.remarks,
    ];
    db.query(query, values, callback);
  },

  findAll: (callback) => {
    const query = `SELECT * FROM consignments ORDER BY created_at DESC`;
    db.query(query, callback);
  },

  // Pagination + Search
  findAllWithPagination: (page = 1, limit = 10, search = "", callback) => {
    const offset = (page - 1) * limit;
    let whereClause = "";
    let queryParams = [];

    // Search condition (add more columns if needed)
    if (search && search.trim() !== "") {
      whereClause = `
      WHERE 
        consignment_no LIKE ? OR 
        sender_name LIKE ? OR 
        receiver_name LIKE ? OR 
        status LIKE ?
    `;
      for (let i = 0; i < 4; i++) queryParams.push(`%${search}%`);
    }

    const dataQuery = `
    SELECT * 
    FROM consignments
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total 
    FROM consignments 
    ${whereClause};
  `;

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      db.query(
        dataQuery,
        [...queryParams, parseInt(limit), parseInt(offset)],
        (err, results) => {
          if (err) return callback(err);

          callback(null, {
            consignments: results,
            currentPage: page,
            nextPage,
            prevPage,
            totalPages,
            totalRecords,
          });
        }
      );
    });
  },

  findById: (id, callback) => {
    const query = `SELECT * FROM consignments WHERE id = ?`;
    db.query(query, [id], callback);
  },

  update: (id, data, callback) => {
    const query = `
            UPDATE consignments SET 
                consignment_id = ?, date = ?,  school_name = ?, via = ?,
                vehicle_number = ?, driver_name = ?, driver_contact_number = ?, 
                tracking_number = ?, courier_company = ?, delivery_date = ?, 
                postal_tracking_number = ?, postal_name = ?, postal_delivery_date = ?, 
                goodies = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`;
    const values = [
      data.consignment_id,
      data.date,
      data.school_name,
      data.via,
      data.vehicle_number,
      data.driver_name,
      data.driver_contact_number,
      data.tracking_number,
      data.courier_company,
      data.delivery_date,
      data.postal_tracking_number,
      data.postal_name,
      data.postal_delivery_date,
      JSON.stringify(data.goodies || null),
      data.remarks,
      id,
    ];
    db.query(query, values, callback);
  },

  delete: (id, callback) => {
    const query = `DELETE FROM consignments WHERE id = ?`;
    db.query(query, [id], callback);
  },
};

export default Consignment;
