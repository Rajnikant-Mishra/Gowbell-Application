import { db } from "../../config/db.js";
import bcrypt from "bcrypt";
const User = {
  // createUser: (user, callback) => {
  //   const query = `INSERT INTO users (role, username, email, phone, status, password, confirm_password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  //   db.query(
  //     query,
  //     [
  //       user.role,
  //       user.username,
  //       user.email,
  //       user.phone,
  //       user.status,
  //       user.password,
  //       user.confirm_password,
  //     ],
  //     callback
  //   );
  // },

  createUser: (user, callback) => {
    const query = `
      INSERT INTO users (role, username, email, phone, status, password, confirm_password, user_profile)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        user.role,
        user.username,
        user.email,
        user.phone,
        user.status,
        user.password,
        user.confirm_password,
        user.user_profile,
      ],
      callback
    );
  },

  // User login
  getUserByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
  },

  getMenusByRole: (role, callback) => {
    const query = `SELECT * FROM menus WHERE role = ?`;
    db.query(query, [role], callback);
  },

  getAllUsers: (callback) => {
    const query = `
        SELECT users.*, roles.role_name 
        FROM users 
        INNER JOIN roles ON users.role = roles.id
    `;
    db.query(query, callback);
  },

  getUserById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [id], callback);
  },

  // updateUser: (id, user, callback) => {
  //   const query = `UPDATE users SET role = ?, username = ?, email = ?, phone = ?, status = ?, password = ?, confirm_password= ? WHERE id = ?`;
  //   db.query(
  //     query,
  //     [
  //       user.role,
  //       user.username,
  //       user.email,
  //       user.phone,
  //       user.status,
  //       user.password,
  //       user.confirm_password,
  //       id,
  //     ],
  //     callback
  //   );
  // },

  // updateUser: (id, user, callback) => {
  //   const query = `
  //   UPDATE users
  //   SET role = ?, username = ?, email = ?, phone = ?, status = ?, password = ?, confirm_password = ?, user_profile = ?
  //   WHERE id = ?
  // `;
  //   db.query(
  //     query,
  //     [
  //       user.role,
  //       user.username,
  //       user.email,
  //       user.phone,
  //       user.status,
  //       user.password,
  //       user.confirm_password,
  //       user.user_profile || null, // update profile image if provided
  //       id,
  //     ],
  //     callback
  //   );
  // },

  updateUser: (id, user, callback) => {
    const query = `
    UPDATE users 
    SET role = ?, username = ?, email = ?, phone = ?, status = ?, password = ?, confirm_password = ?, user_profile = ?
    WHERE id = ?
  `;
    db.query(
      query,
      [
        user.role,
        user.username,
        user.email,
        user.phone,
        user.status,
        user.password,
        user.confirm_password,
        user.user_profile,
        id,
      ],
      callback
    );
  },

  deleteUser: (id, callback) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], callback);
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, username, role
        FROM users
        WHERE id = ?
      `;
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          resolve(null); // user not found
        } else {
          resolve(results[0]);
        }
      });
    });
  },

  // Update password
  // updatePassword: (id, newPassword, callback) => {
  //   bcrypt.hash(newPassword, 10, (err, hash) => {
  //     if (err) return callback(err);
  //     const query = `UPDATE users SET password = ? WHERE id = ?`;
  //     db.query(query, [hash, id], callback);
  //   });
  // },

  updatePassword: (id, data, callback) => {
    const { password, user_profile } = data;

    // Start dynamic query
    let query = "UPDATE users SET ";
    const values = [];

    if (password) {
      // Hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return callback(err);

        query += "password = ?";
        values.push(hash);

        if (user_profile) {
          query += ", user_profile = ?";
          values.push(user_profile);
        }

        query += " WHERE id = ?";
        values.push(id);

        db.query(query, values, callback);
      });
    } else if (user_profile) {
      // Only updating image
      query += "user_profile = ? WHERE id = ?";
      values.push(user_profile, id);

      db.query(query, values, callback);
    }
  },
};

export default User;
