import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RoleMenu from "../../models/configuration/role_menuModel.js";
import Role from "../../models/Role/roleModel.js";
import User from "../../models/User/userModel.js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables


  // Create a new user
  export const createUser = (req, res) => {
    const { role, username, email, phone, status, password, confirm_password } =
      req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Failed to encrypt password" });
      }

      const newUser = {
        role,
        username,
        email,
        phone,
        status,
        password: hashedPassword,
        confirm_password: hashedPassword,
      };

      User.createUser(newUser, (dbErr, result) => {
        if (dbErr) {
          return res.status(500).json({ error: dbErr.message });
        }
        res.status(201).json({
          message: "User created successfully",
          userId: result.insertId,
        });
      });
    });
  };

  // User login
  export const loginUser = (req, res) => {
    const { email, password } = req.body;

    User.getUserByEmail(email, (err, users) => {
      if (err || users.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = users[0];
      bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
        if (bcryptErr || !isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "3600000" }
        );

        RoleMenu.getMenusByRole(user.role, (menuErr, menus) => {
          if (menuErr) {
            return res.status(500).json({ error: "Failed to fetch menus" });
          }

          // Fetch role details after login         
          Role.getById(user.role, (roleErr, roleDetails) => {
            if (roleErr) {
              return res
                .status(500)
                .json({ error: "Failed to fetch role details" });
            }

            res.status(200).json({
              message: "Login successful",         
              token,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                status: user.status,
                role: user.role,
              },
              roleDetails, // Role details included in the response
              menus,
            });
          });
        });
      });
    });
  };

  // Logout user
  export const logoutUser = (req, res) => {
    // Invalidate the JWT token on the client side by removing it
    res.status(200).json({ message: "Logged out successfully" });
  };

 

  // Other CRUD operations...
 export const getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  };

  export const getUserById = (req, res) => {
    const { id } = req.params;

    User.getUserById(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(results[0]);
    });
  };

  export const updateUser = (req, res) => {
    const { id } = req.params;
    const { role, username, email, phone, status, password, confirm_password } =
      req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Failed to encrypt password" });
      }

      const updatedUser = {
        role,
        username,
        email,
        phone,
        status,
        password: hashedPassword,
        confirm_password: hashedPassword,
      };

      User.updateUser(id, updatedUser, (dbErr, result) => {
        if (dbErr) {
          return res.status(500).json({ error: dbErr.message });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully" });
      });
    });
  };

  export const deleteUser = (req, res) => {
    const { id } = req.params;

    User.deleteUser(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    });
  };


//for user data
export const getUserProfile = (req, res) => {
  const userId = req.user.id; // Extracted from the JWT by `verifyToken`

  User.getUserById(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(results[0]);
  });
};


