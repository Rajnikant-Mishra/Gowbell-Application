import bcrypt from "bcryptjs";
import { db } from "../../config/db.js";

export const Admin = {
  // Create a new admin
  createAdmin: async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO admin (username, email, password) VALUES (?, ?, ?)";
    return new Promise((resolve, reject) => {
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error creating admin:', err); 
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  // Find an admin by email
  findByEmail: (email) => {
    const query = "SELECT * FROM admin WHERE email = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [email], (err, result) => {
        if (err) {
          console.error('Error fetching admin by email:', err); // Log the error for debugging
          reject(err);
        } else if (result.length === 0) {
          resolve(null);  // No admin found
        } else {
          resolve(result[0]); // Return the first admin object
        }
      });
    });
  },

  // Update admin details (username, email, password)
  updateAdminDetails: async (id, username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `          
      UPDATE admin 
      SET username = ?, email = ?, password = ? 
      WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
      db.query(query, [username, email, hashedPassword, id], (err, result) => {
        if (err) {
          console.error('Error updating admin details:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};
