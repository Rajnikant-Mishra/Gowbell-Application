import { db } from "../../config/db.js";

const Session = {
  getAll: (callback) => {
    db.query('SELECT * FROM gowvell_session', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM gowvell_session WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO gowvell_session (session, status) VALUES (?, ?)', [data.session, data.status], callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE gowvell_session SET session = ?, status = ? WHERE id = ?', [data.session, data.status, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM gowvell_session WHERE id = ?', [id], callback);
  },
};

export default Session;
