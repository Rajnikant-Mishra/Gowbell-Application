import { db } from '../../config/db.js';

const User = {
  createUser: (user, callback) => {
    
    const query = `INSERT INTO users (role, username, email, phone, status, password, confirm_password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [user.role, user.username, user.email, user.phone, user.status, user.password, user.confirm_password], callback);

  },

  // User login
  getUserByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
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
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], callback);
  },

  updateUser: (id, user, callback) => {
    const query = `UPDATE users SET role = ?, username = ?, email = ?, phone = ?, status = ?, password = ?, confirm_password= ? WHERE id = ?`;
    db.query(query, [user.role, user.username, user.email, user.phone, user.status, user.password, user.confirm_password, id], callback);
  },

  deleteUser: (id, callback) => {
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], callback);
  }
};

export default User;
