// import { db } from '../../config/db.js';

// const Role = {
//     // Create a new role with permissions
//     create: (role_name, permissions, callback) => {
//         const query = 'INSERT INTO roles (role_name, permissions) VALUES (?, ?)';
//         db.query(query, [role_name, permissions], callback);
//     },

//     // Get all roles
//     getAll: (callback) => {
//         const query = 'SELECT * FROM roles';
//         db.query(query, callback);
//     },

//     // Get a role by its ID
//     getById: (id, callback) => {
//         const query = 'SELECT * FROM roles WHERE id = ?';
//         db.query(query, [id], (err, result) => {
//             if (err) return callback(err, null);
//             callback(null, result.length ? result[0] : null);
//         });
//     },

//     // Update a role by its ID
//     update: (id, role_name, permissions, callback) => {
//         const query = 'UPDATE roles SET role_name = ?, permissions = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
//         db.query(query, [role_name, permissions, id], callback);
//     },

//     // Delete a role by its ID
//     delete: (id, callback) => {
//         const query = 'DELETE FROM roles WHERE id = ?';
//         db.query(query, [id], callback);
//     }
// };

// export default Role;
import { db } from "../../config/db.js";

const Role = {
  // Create a new role (without permissions)
  create: (role_name, callback) => {
    const query = "INSERT INTO roles (role_name) VALUES (?)";
    db.query(query, [role_name], callback);
  },

  // Get all roles
  getAll: (callback) => {
    const query = "SELECT * FROM roles";
    db.query(query, callback);
  },

  // Get a role by its ID (only role_name)
  getById: (id, callback) => {
    const query = "SELECT id, role_name FROM roles WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result.length ? result[0] : null);
    });
  },

  // Update a role by its ID (without permissions)
  update: (id, role_name, callback) => {
    const query =
      "UPDATE roles SET role_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    db.query(query, [role_name, id], callback);
  },

  // Delete a role by its ID
  delete: (id, callback) => {
    const query = "DELETE FROM roles WHERE id = ?";
    db.query(query, [id], callback);
  },
};

export default Role;
