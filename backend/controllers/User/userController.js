import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RoleMenu from "../../models/configuration/role_menuModel.js";
import Role from "../../models/Role/roleModel.js";
import User from "../../models/User/userModel.js";
import { logActivity } from "../../models/dashboard/activityModel.js";
import fs from "fs"; // optional: for deleting old image if needed
import { db } from "../../config/db.js";

import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create a new user
export const createUser = (req, res) => {
  const { role, username, email, phone, status, password, confirm_password } =
    req.body;

  // Check passwords match
  if (password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Get uploaded image filename (if provided)
  const user_profile = req.file ? req.file.filename : null;

  // Hash password
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
      user_profile, // Add image filename here
    };

    User.createUser(newUser, (dbErr, result) => {
      if (dbErr) {
        return res.status(500).json({ error: dbErr.message });
      }

      res.status(201).json({
        message: "User created successfully",
        userId: result.insertId,
        image: user_profile,
      });
    });
  });
};

// User login
// export const loginUser = (req, res) => {
//   const { email, password } = req.body;

//   User.getUserByEmail(email, (err, users) => {
//     if (err || users.length === 0) {
//       return res.status(401).json({ error: "Invalid Email Please try again." });
//     }

//     const user = users[0];
//     bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
//       if (bcryptErr || !isMatch) {
//         return res
//           .status(401)
//           .json({ error: "Invalid password Please try again." });
//       }

//       const token = jwt.sign(
//         { id: user.id, role: user.role, username: user.username },
//         process.env.JWT_SECRET,
//         { expiresIn: "3600000" }
//       );

//       RoleMenu.getMenusByRole(user.role, (menuErr, menus) => {
//         if (menuErr) {
//           return res.status(500).json({ error: "Failed to fetch menus" });
//         }

//         // Fetch role details after login
//         Role.getById(user.role, (roleErr, roleDetails) => {
//           if (roleErr) {
//             return res
//               .status(500)
//               .json({ error: "Failed to fetch role details" });
//           }

//           // ----------- Add activity log here -------------
//           const activityMessage = `${user.username} logged in`; // e.g., Admin logged in
//           logActivity({
//             user_id: user.id,
//             user_name: user.username,
//             activity: activityMessage,
//             data: { email: user.email },
//             ip_address: req.ip || req.connection.remoteAddress,
//           });

//           res.status(200).json({
//             message: "Login successful",
//             token,
//             user: {
//               id: user.id,
//               username: user.username,
//               email: user.email,
//               user_profile: user.user_profile,
//               phone: user.phone,
//               status: user.status,
//               role: user.role,
//             },
//             roleDetails, // Role details included in the response
//             menus,
//           });
//         });
//       });
//     });
//   });
// };

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.getUserByEmail(email, (err, users) => {
    if (err || users.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid Email. Please try again." });
    }

    const user = users[0];

    bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
      if (bcryptErr || !isMatch) {
        return res
          .status(401)
          .json({ error: "Invalid password. Please try again." });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "3000000" }
      );

      // Fetch menus by role
      RoleMenu.getMenusByRole(user.role, (menuErr, menus) => {
        if (menuErr) {
          return res.status(500).json({ error: "Failed to fetch menus" });
        }

        // Fetch role details
        Role.getById(user.role, (roleErr, roleDetails) => {
          if (roleErr) {
            return res
              .status(500)
              .json({ error: "Failed to fetch role details" });
          }

          // ---------- Fetch OMR Assign records by staff_id ----------
          const omrQuery = `
            SELECT 
              oa.id,
              oa.country_id,
              oa.state_id,
              oa.district_id,
              oa.city_id,
              oa.school_id,
              s.school_name,
              oa.class_id,
              c.name AS class_name,
              oa.subject_id,
              sub.name AS subject_name,
              oa.student_id,
              st.student_name,
              oa.roll_no,
              oa.student_section,
              oa.staff_id,
              oa.status,
              oa.created_at,
              oa.updated_at
            FROM omr_assign oa
            LEFT JOIN school s ON s.id = oa.school_id
            LEFT JOIN class c ON c.id = oa.class_id
            LEFT JOIN subject_master sub ON sub.id = oa.subject_id
            LEFT JOIN student st ON st.id = oa.student_id
            WHERE oa.staff_id = ?
          `;

          db.query(omrQuery, [user.id], (omrErr, omrData) => {
            if (omrErr) {
              console.error("OMR fetch error:", omrErr);
              return res
                .status(500)
                .json({ error: "Failed to fetch OMR assignments" });
            }

            // ---------- Log activity ----------
            const activityMessage = `${user.username} logged in`;
            logActivity({
              user_id: user.id,
              user_name: user.username,
              activity: activityMessage,
              data: { email: user.email },
              ip_address: req.ip || req.connection.remoteAddress,
            });

            // ---------- Final Response ----------
            res.status(200).json({
              message: "Login successful",
              token,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                user_profile: user.user_profile,
                phone: user.phone,
                status: user.status,
                role: user.role,
              },
              roleDetails,
              menus,
              omr_assign: omrData, // 👈 OMR data included here
            });
          });
        });
      });
    });
  });
};

// Logout user
export const logoutUser = (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const activityMessage = `${decoded.username} logged out`;

    logActivity({
      user_id: decoded.id,
      user_name: decoded.username, // ✅ now available
      activity: activityMessage,
      data: {},
      ip_address: req.ip || req.connection.remoteAddress,
    });

    // Invalidate the JWT token on client side
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
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

// export const updateUser = (req, res) => {
//   const { id } = req.params;
//   const { role, username, email, phone, status, password, confirm_password } =
//     req.body;

//   if (password !== confirm_password) {
//     return res.status(400).json({ error: "Passwords do not match" });
//   }

//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to encrypt password" });
//     }

//     const updatedUser = {
//       role,
//       username,
//       email,
//       phone,
//       status,
//       password: hashedPassword,
//       confirm_password: hashedPassword,
//     };

//     User.updateUser(id, updatedUser, (dbErr, result) => {
//       if (dbErr) {
//         return res.status(500).json({ error: dbErr.message });
//       }
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       res.status(200).json({ message: "User updated successfully" });
//     });
//   });
// };

// export const updateUser = (req, res) => {
//   const { id } = req.params;
//   const { role, username, email, phone, status, password, confirm_password } =
//     req.body;
//   const user_profile = req.file ? req.file.filename : null; // assuming you're using multer

//   if (password !== confirm_password) {
//     return res.status(400).json({ error: "Passwords do not match" });
//   }

//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to encrypt password" });
//     }

//     const updatedUser = {
//       role,
//       username,
//       email,
//       phone,
//       status,
//       password: hashedPassword,
//       confirm_password: hashedPassword,
//       user_profile, // updated profile image
//     };

//     User.updateUser(id, updatedUser, (dbErr, result) => {
//       if (dbErr) {
//         return res.status(500).json({ error: dbErr.message });
//       }
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       res.status(200).json({ message: "User updated successfully" });
//     });
//   });
// };

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { role, username, email, phone, status, password, confirm_password } =
    req.body;

  const user_profile = req.file ? req.file.filename : null; // from multer

  // 1️⃣ Fetch existing user first
  User.getUserById(id, (err, existingUser) => {
    if (err || !existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2️⃣ Prepare updated fields
    const updatedUser = {
      role,
      username,
      email,
      phone,
      status,
      user_profile: user_profile || existingUser.user_profile, // keep old image if not new
      password: existingUser.password, // default keep old password
      confirm_password: existingUser.confirm_password,
    };

    // 3️⃣ If password fields are filled, update it
    if (password && confirm_password) {
      if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

      // hash only if password provided
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          return res.status(500).json({ error: "Failed to encrypt password" });
        }

        updatedUser.password = hashedPassword;
        updatedUser.confirm_password = hashedPassword;

        // update user in DB
        User.updateUser(id, updatedUser, (dbErr, result) => {
          if (dbErr) {
            return res.status(500).json({ error: dbErr.message });
          }
          res.status(200).json({ message: "User updated successfully" });
        });
      });
    } else {
      // 4️⃣ Update without changing password
      User.updateUser(id, updatedUser, (dbErr, result) => {
        if (dbErr) {
          return res.status(500).json({ error: dbErr.message });
        }
        res.status(200).json({ message: "User updated successfully" });
      });
    }
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

// Update user password
// export const updatePassword = (req, res) => {
//   const { id } = req.params;
//   const { password } = req.body;

//   if (!password) return res.status(400).json({ message: "Password  required" });

//   User.updatePassword(id, password, (err, results) => {
//     if (err) return res.status(500).json({ message: err.message });
//     res.json({ message: "Password updated successfully" });
//   });
// };

// ✅ Update user (password optional)
export const updatePassword = (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const user_profile = req.file ? req.file.filename : null;

  if (!password && !user_profile) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const updateData = { password, user_profile };

  User.updatePassword(id, updateData, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    res.json({
      message: "User updated successfully",
      user_profile: user_profile || null, // send updated image filename
    });
  });
};
