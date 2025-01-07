import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User/userModel.js';

const usersController = {
  // Create a new user
  createUser: (req, res) => {
    const { role, username, email, phone, status, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Failed to encrypt password" });
      }

      const newUser = { role, username, email, phone, status, password: hashedPassword };

      User.createUser(newUser, (dbErr, result) => {
        if (dbErr) {
          return res.status(500).json({ error: dbErr.message });
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
      });
    });
  },

  // User login
  loginUser: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    User.getUserByEmail(email, (err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (users.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = users[0];
      bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
        if (bcryptErr || !isMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        });
      });
    });
  },


   // Logout user
   logoutUser: (req, res) => {
    // Invalidate the JWT token on the client side by removing it
    res.status(200).json({ message: 'Logged out successfully' });
  },
  

  // Other CRUD operations...

  getAllUsers: (req, res) => {
    User.getAllUsers((err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  },

  getUserById: (req, res) => {
    const { id } = req.params;

    User.getUserById(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(results[0]);
    });
  },

  updateUser: (req, res) => {
    const { id } = req.params;
    const { role, username, email, phone, status, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Failed to encrypt password" });
      }

      const updatedUser = { role, username, email, phone, status, password: hashedPassword };

      User.updateUser(id, updatedUser, (dbErr, result) => {
        if (dbErr) {
          return res.status(500).json({ error: dbErr.message });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
      });
    });
  },

  deleteUser: (req, res) => {
    const { id } = req.params;

    User.deleteUser(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    });
  }
};

export default usersController;
