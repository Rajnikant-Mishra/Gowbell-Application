import { db } from "../../config/db.js";

const OmrReceipt = {
  getAll: (callback) => {
    const sql = "SELECT * FROM omr_receipt";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM omr_receipt WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = "INSERT INTO omr_receipt SET ?";
    db.query(sql, data, callback);
  },

  update: (id, data, callback) => {
    const sql = "UPDATE omr_receipt SET ? WHERE id = ?";
    db.query(sql, [data, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM omr_receipt WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

export default OmrReceipt;
