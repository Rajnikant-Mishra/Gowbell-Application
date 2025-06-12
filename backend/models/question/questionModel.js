import { db } from "../../config/db.js";

export const QuestionModel = {
  getAll: (callback) => {
    db.query("SELECT * FROM questions", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM questions WHERE id = ?", [id], callback);
  },

  create: (data, callback) => {
    const query = `
      INSERT INTO questions (country_id, state_id, district_id, city_id, school_name, set_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [data.country_id, data.state_id, data.district_id, data.city_id, data.school_name, data.set_name];
    db.query(query, values, callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE questions SET country_id=?, state_id=?, district_id=?, city_id=?, school_name=?, set_name=?
      WHERE id = ?
    `;
    const values = [data.country_id, data.state_id, data.district_id, data.city_id, data.school_name, data.set_name, id];
    db.query(query, values, callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM questions WHERE id = ?", [id], callback);
  },
};
