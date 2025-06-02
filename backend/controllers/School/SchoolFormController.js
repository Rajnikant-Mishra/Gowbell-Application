import Joi from "joi";
import School from "../../models/School/SchoolFormModel.js";
import { sendEmail } from "../../controllers/School/mailer.js";
import { sendSms } from "../../controllers/School/smsService.js";
import { db } from "../../config/db.js";
import User from "../../models/User/userModel.js";

// export const createSchool = async (req, res) => {
//   const { id } = req.user; // Only id is guaranteed from req.user
//   const data = req.body;

//   try {
//     // Query to fetch username and role from the database using user id
//     const sqlGetUser = `SELECT username, role FROM users WHERE id = ?`;
//     const [user] = await new Promise((resolve, reject) => {
//       db.query(sqlGetUser, [id], (err, results) => {
//         if (err) return reject(err);
//         resolve(results);
//       });
//     });

//     // Determine status_approved and approved_by based on user role or username
//     let statusApproved;
//     let approvedBy = null; // Default to null for non-admins
//     if (user) {
//       const roleLower = user.role ? user.role.toLowerCase() : "";
//       const isAdmin =
//         (user.username && user.username.toLowerCase().includes("admin")) ||
//         roleLower === "admin";

//       if (isAdmin) {
//         statusApproved = "approved";
//         approvedBy = user.username; // Store admin's username in approved_by
//       } else if (roleLower === "maker") {
//         statusApproved = "pending";
//       } else if (roleLower === "checker") {
//         statusApproved = "approved";
//       } else {
//         statusApproved = "pending"; // Default for other roles
//       }
//     } else {
//       statusApproved = "pending"; // Default if no user found
//     }

//     // Ensure created_by, updated_by, and approved_by are set appropriately
//     const schoolData = {
//       ...data,
//       created_by: id,
//       updated_by: id,
//       status_approved: statusApproved,
//       approved_by: approvedBy, // Add approved_by to schoolData
//     };

//     // Create school in the database
//     const results = await School.create(schoolData);

//     if (!results || !results.insertId) {
//       return res
//         .status(500)
//         .json({ message: "School creation failed, no ID returned" });
//     }

//     const schoolId = results.insertId;
//     const schoolCode = results.school_code;
//     const schoolName = data.school_name;
//     const schoolEmail = data.school_email;
//     const principalPhoneNumber = data.principal_contact_number;

//     // Check if both email and phone are present
//     if (
//       schoolEmail &&
//       principalPhoneNumber &&
//       /^[+]?\d{10,15}$/.test(principalPhoneNumber)
//     ) {
//       // Prepare details for email and SMS
//       const smsMessage = `Dear ${schoolName}, your registration with Gowbell Foundation was successful! Your School Code: ${schoolCode}`;

//       const emailSubject = `School Registration Successful: ${schoolName}`;
//       const emailText = `Dear ${schoolName}, your registration with Gowbell Foundation was successful. Your School Code: ${schoolCode}`;
//       const emailHtml = `<p>Dear <strong>${schoolName}</strong>,</p>
//                         <p>Your registration with Gowbell Foundation was successful.</p>
//                         <p>Your School Code: <strong>${schoolCode}</strong>.</p>`;

//       // Send notifications
//       await Promise.all([
//         sendEmail(schoolEmail, emailSubject, emailText, emailHtml),
//         sendSms(principalPhoneNumber, smsMessage),
//       ]);

//       // Success response with notifications sent
//       return res.status(201).json({
//         message: "School created, email and SMS sent successfully!",
//         id: schoolId,
//         school_code: schoolCode,
//         status_approved: schoolData.status_approved,
//         approved_by: schoolData.approved_by, // Include approved_by in response
//       });
//     } else {
//       // Success response without notifications
//       return res.status(201).json({
//         message:
//           "School created successfully, notifications not sent due to missing or invalid contact information",
//         id: schoolId,
//         school_code: schoolCode,
//         status_approved: schoolData.status_approved,
//         approved_by: schoolData.approved_by, // Include approved_by in response
//       });
//     }
//   } catch (err) {
//     console.error("Error during school creation:", err);

//     if (err.response) {
//       return res.status(500).json({
//         message: "Error in external service",
//         error: err.response.data,
//       });
//     }

//     res.status(500).json({ message: "An error occurred", error: err.message });
//   }
// };

export const createSchool = async (req, res) => {
  const { id } = req.user; // Only id is guaranteed from req.user
  const data = req.body;

  try {
    // Query to fetch username and role from the database using user id
    const sqlGetUser = `SELECT username, role FROM users WHERE id = ?`;
    const [user] = await new Promise((resolve, reject) => {
      db.query(sqlGetUser, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Determine status_approved and approved_by based on user role or username
    let statusApproved;
    let approvedBy = null; // Default to null for non-admins
    if (user) {
      const roleLower = user.role ? user.role.toLowerCase() : "";
      const isAdmin =
        (user.username && user.username.toLowerCase().includes("admin")) ||
        roleLower === "admin";

      if (isAdmin) {
        statusApproved = "approved";
        approvedBy = user.username; // Store admin's username in approved_by
      } else if (roleLower === "maker") {
        statusApproved = "pending";
      } else if (roleLower === "checker") {
        statusApproved = "approved";
      } else {
        statusApproved = "pending"; // Default for other roles
      }
    } else {
      statusApproved = "pending"; // Default if no user found
    }

    // Ensure created_by, updated_by, and approved_by are set appropriately
    const schoolData = {
      ...data,
      created_by: id,
      updated_by: id,
      status_approved: statusApproved,
      approved_by: approvedBy, // Add approved_by to schoolData
    };

    // Create school in the database
    const results = await School.create(schoolData);

    if (!results || !results.insertId) {
      return res
        .status(500)
        .json({ message: "School creation failed, no ID returned" });
    }

    const schoolId = results.insertId;
    const schoolCode = results.school_code;

    // Success response
    return res.status(201).json({
      message: "School created successfully",
      id: schoolId,
      school_code: schoolCode,
      status_approved: schoolData.status_approved,
      approved_by: schoolData.approved_by, // Include approved_by in response
    });
  } catch (err) {
    console.error("Error during school creation:", err);

    if (err.response) {
      return res.status(500).json({
        message: "Error in external service",
        error: err.response.data,
      });
    }

    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

// export const bulkUploadSchools = async (req, res) => {
//   const { id } = req.user;
//   const schools = req.body;

//   try {
//     const schoolsWithUserData = schools.map((school) => ({
//       ...school,
//       created_by: id,
//       updated_by: id,
//     }));

//     const results = await School.bulkCreate(schoolsWithUserData);

//     if (!results || results.affectedRows === 0) {
//       return res.status(500).json({ message: "Failed to insert schools" });
//     }

//     results.schools.forEach((school) => {
//       if (school.school_email && school.principal_contact_number) {
//         const subject = `School Registration Successful: ${school.school_name}`;
//         const text = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful. School Code: ${school.school_code}`;
//         const html = `
//           <p>Dear <strong>${school.school_name}</strong>,</p>
//           <p>Registration successful with Gowbell Foundation.</p>
//           <p>Your School Code is <strong>${school.school_code}</strong>.</p>
//         `;

//         sendEmail(school.school_email, subject, text, html);
//         sendSms(school.principal_contact_number, text);
//       }
//     });

//     res.status(201).json({
//       message: "Schools uploaded successfully",
//       insertedCount: results.affectedRows,
//       schools: results.schools,
//       errors: results.errors || [],
//     });
//   } catch (err) {
//     console.error("Bulk upload error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

export const bulkUploadSchools = async (req, res) => {
  const { id } = req.user;
  const schools = req.body;

  try {
    const schoolsWithUserData = schools.map((school) => ({
      ...school,
      created_by: id,
      updated_by: id,
    }));

    const results = await School.bulkCreate(schoolsWithUserData);

    if (!results || results.affectedRows === 0) {
      return res.status(500).json({ message: "Failed to insert schools" });
    }

    res.status(201).json({
      message: "Schools uploaded successfully",
      insertedCount: results.affectedRows,
      schools: results.schools,
      errors: results.errors || [],
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all schools
export const getAll = (req, res) => {
  School.getAllSchool((err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

export const getAllSchools = (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  School.getAll(page, limit, search, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(data);
  });
};

// Get school by ID
export const getSchoolById = (req, res) => {
  const id = req.params.id;
  School.getById(id, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("School not found");
    res.status(200).json(results[0]);
  });
};

// Update school
export const updateSchool = (req, res) => {
  const id = req.params.id;
  const data = req.body;

  // Update school in the database (replace `School.update` with your database query)
  School.update(id, data, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    res
      .status(200)
      .json({ message: "School updated successfully", data: results });
  });
};

// Delete school
export const deleteSchool = (req, res) => {
  const id = req.params.id;
  School.delete(id, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "School deleted" });
  });
};

// Filter schools by location
export const filterByLocation = (req, res) => {
  const { country, state, district, city } = req.query;

  const filters = {
    country: country || null,
    state: state || null,
    district: district || null,
    city: city || null,
  };

  School.getSchoolCountByLocation(filters)
    .then((schoolData) => {
      if (schoolData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No schools found for the selected filters",
        });
      }

      res.status(200).json({
        success: true,
        total_schools: schoolData.reduce(
          (sum, item) => sum + item.school_count,
          0
        ),
        data: schoolData.map((item) => ({
          country: item.country_name,
          state: item.state_name,
          district: item.district_name,
          city: item.city_name,
          school_count: item.school_count,
          schools: item.school_names ? item.school_names.split(",") : [],
        })),
      });
    })
    .catch((err) => {
      console.error("Error fetching school count:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch school count",
        error: err.message,
      });
    });
};

//approvede code

// export const updateStatusApproved = async (req, res) => {
//   try {
//     const { id: userId } = req.user; // logged-in user's ID
//     if (!userId) {
//       return res.status(401).json({ error: "User ID is missing from token" });
//     }

//     const { id: schoolId } = req.params;
//     const { status_approved } = req.body;

//     if (!status_approved) {
//       return res.status(400).json({ message: "status_approved is required" });
//     }

//     // ✅ Fetch the user and role_name from DB using JOIN
//     const sql = `
//       SELECT users.*, roles.role_name
//       FROM users
//       JOIN roles ON users.role = roles.id
//       WHERE users.id = ?
//     `;

//     db.query(sql, [userId], async (err, results) => {
//       if (err) {
//         console.error("Error querying user and role:", err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       const user = results[0];

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const { role_name, username } = user;

//       // ✅ Role-based access control
//       if (role_name !== "admin" && role_name !== "checker") {
//         return res.status(403).json({
//           message: "Only admin or checker can approve",
//         });
//       }

//       // ✅ Call your existing model function to update status
//       try {
//         const result = await School.updateStatusApprovedById(
//           schoolId,
//           status_approved,
//           user.username
//         );

//         if (result.affectedRows === 0) {
//           return res.status(404).json({ message: "School not found" });
//         }

//         return res.json({ message: "Approved updated successfully" });
//       } catch (updateError) {
//         console.error("Error updating status:", updateError);
//         return res.status(500).json({ error: updateError.message });
//       }
//     });
//   } catch (error) {
//     console.error("Error in updateStatusApproved:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const updateStatusApproved = async (req, res) => {
//   try {
//     const { id: userId } = req.user; // logged-in user's ID
//     if (!userId) {
//       return res.status(401).json({ error: "User ID is missing from token" });
//     }

//     const { id: schoolId } = req.params;
//     const { status_approved } = req.body;

//     if (!status_approved) {
//       return res.status(400).json({ message: "status_approved is required" });
//     }

//     // ✅ Fetch user and role
//     const sql = `
//       SELECT users.*, roles.role_name
//       FROM users
//       JOIN roles ON users.role = roles.id
//       WHERE users.id = ?
//     `;

//     db.query(sql, [userId], async (err, results) => {
//       if (err) {
//         console.error("Error querying user and role:", err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       const user = results[0];

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const { role_name, username } = user;

//       // ✅ Role-based access control
//       if (status_approved === "approved") {
//         if (role_name !== "admin" && role_name !== "checker") {
//           return res.status(403).json({
//             message: "Only admin or checker can approve",
//           });
//         }
//       } else if (status_approved === "rejected") {
//         if (role_name !== "admin") {
//           return res.status(403).json({
//             message: "Only admin can rejected",
//           });
//         }
//       } else if (status_approved === "pending") {
//         if (role_name !== "admin") {
//           return res.status(403).json({
//             message: "Only admin can pending",
//           });
//         }
//       } else {
//         return res.status(400).json({
//           message: "Invalid status_approved value",
//         });
//       }

//       // ✅ Call your existing model function
//       try {
//         const result = await School.updateStatusApprovedById(
//           schoolId,
//           status_approved,
//           username
//         );

//         if (result.affectedRows === 0) {
//           return res.status(404).json({ message: "School not found" });
//         }

//         return res.json({
//           message: `Status updated to ${status_approved} successfully`,
//         });
//       } catch (updateError) {
//         console.error("Error updating status:", updateError);
//         return res.status(500).json({ error: updateError.message });
//       }
//     });
//   } catch (error) {
//     console.error("Error in updateStatusApproved:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

///////-----------------------
// export const updateStatusApproved = async (req, res) => {
//   try {
//     const { id: userId } = req.user; // logged-in user's ID
//     if (!userId) {
//       return res.status(401).json({ error: "User ID is missing from token" });
//     }

//     const { id: schoolId } = req.params;
//     const { status_approved } = req.body;

//     if (!status_approved) {
//       return res.status(400).json({ message: "status_approved is required" });
//     }

//     // ✅ Fetch user and role
//     const sqlUser = `
//       SELECT users.*, roles.role_name
//       FROM users
//       JOIN roles ON users.role = roles.id
//       WHERE users.id = ?
//     `;

//     db.query(sqlUser, [userId], async (err, results) => {
//       if (err) {
//         console.error("Error querying user and role:", err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       const user = results[0];

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const { role_name, username } = user;

//       // ✅ Role-based access control
//       if (status_approved === "approved") {
//         if (role_name !== "admin" && role_name !== "checker") {
//           return res.status(403).json({
//             message: "Only admin or checker can approve",
//           });
//         }
//       } else if (status_approved === "rejected") {
//         if (role_name !== "admin") {
//           return res.status(403).json({
//             message: "Only admin can reject",
//           });
//         }
//       } else if (status_approved === "pending") {
//         if (role_name !== "admin") {
//           return res.status(403).json({
//             message: "Only admin can set to pending",
//           });
//         }
//       } else {
//         return res.status(400).json({
//           message: "Invalid status_approved value",
//         });
//       }

//       // ✅ Fetch school email and name
//       const sqlSchool = `
//         SELECT school_email, school_name
//         FROM school
//         WHERE id = ?
//       `;

//       db.query(sqlSchool, [schoolId], async (err, schoolResults) => {
//         if (err) {
//           console.error("Error querying school email and name:", err);
//           return res.status(500).json({ error: "Database error" });
//         }

//         if (!schoolResults[0]) {
//           return res.status(404).json({ message: "School not found" });
//         }

//         const { school_email, school_name } = schoolResults[0];

//         // ✅ Update school status
//         try {
//           const result = await School.updateStatusApprovedById(
//             schoolId,
//             status_approved,
//             username
//           );

//           if (result.affectedRows === 0) {
//             return res.status(404).json({ message: "School not found" });
//           }

//           // ✅ Send email notification with school name
//           const subject = `School Status Update: ${
//             status_approved.charAt(0).toUpperCase() + status_approved.slice(1)
//           }`;
//           const text = `Dear School Administrator,\n\nThe status of your school, ${school_name}, has been updated to "${status_approved}".\n\nBest regards,\nThe Approval Team`;
//           const html = `
//             <h3>School Status Update</h3>
//             <p>Dear School Administrator,</p>
//             <p>The status of your school, <strong>${school_name}</strong>, has been updated to <strong>${status_approved}</strong>.</p>
//             <p>Best regards,<br>The Approval Team</p>
//           `;

//           try {
//             await sendEmail(school_email, subject, text, html);
//             console.log(`Email sent to ${school_email} for ${school_name}`);
//           } catch (emailError) {
//             console.error("Error sending email:", emailError);
//             // Note: Not failing the request if email fails, just logging
//           }

//           return res.json({
//             message: `Status updated to ${status_approved} successfully`,
//           });
//         } catch (updateError) {
//           console.error("Error updating status:", updateError);
//           return res.status(500).json({ error: updateError.message });
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Error in updateStatusApproved:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
// export const updateStatusApproved = async (req, res) => {
//   try {
//     const { id: userId } = req.user; // logged-in user's ID
//     if (!userId) {
//       return res.status(401).json({ error: "User ID is missing from token" });
//     }

//     const { id: schoolId } = req.params;
//     const { status_approved } = req.body;

//     if (!status_approved) {
//       return res.status(400).json({ message: "status_approved is required" });
//     }

//     // ✅ Fetch user and role
//     const sqlUser = `
//       SELECT users.*, roles.role_name
//       FROM users
//       JOIN roles ON users.role = roles.id
//       WHERE users.id = ?
//     `;

//     db.query(sqlUser, [userId], async (err, results) => {
//       if (err) {
//         console.error("Error querying user and role:", err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       const user = results[0];

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const { role_name, username } = user;

//       // ✅ Role-based access control
//       if (status_approved === "approved") {
//         if (role_name !== "admin" && role_name !== "checker") {
//           return res.status(403).json({
//             message: "Only admin or checker can approve",
//           });
//         }
//       } else if (status_approved === "rejected") {
//         if (role_name !== "admin") {
//           return res.status(403).json({
//             message: "Only admin can reject",
//           });
//         }
//       } else if (status_approved === "pending") {
//         if (role_name !== "admin") {
//           return res.status(403).json({
//             message: "Only admin can set to pending",
//           });
//         }
//       } else {
//         return res.status(400).json({
//           message: "Invalid status_approved value",
//         });
//       }

//       // ✅ Fetch school email, name, and contact number
//       const sqlSchool = `
//         SELECT school_email, school_name, school_contact_number
//         FROM school
//         WHERE id = ?
//       `;

//       db.query(sqlSchool, [schoolId], async (err, schoolResults) => {
//         if (err) {
//           console.error("Error querying school details:", err);
//           return res.status(500).json({ error: "Database error" });
//         }

//         if (!schoolResults[0]) {
//           return res.status(404).json({ message: "School not found" });
//         }

//         const { school_email, school_name, school_contact_number } =
//           schoolResults[0];

//         // ✅ Update school status
//         try {
//           const result = await School.updateStatusApprovedById(
//             schoolId,
//             status_approved,
//             username
//           );

//           if (result.affectedRows === 0) {
//             return res.status(404).json({ message: "School not found" });
//           }

//           // ✅ Send email notification with school name
//           const subject = `School Status Update: ${
//             status_approved.charAt(0).toUpperCase() + status_approved.slice(1)
//           }`;
//           const text = `Dear School Administrator,\n\nThe status of your school, ${school_name}, has been updated to "${status_approved}".\n\nBest regards,\nThe Approval Team`;
//           const html = `
//             <h3>School Status Update</h3>
//             <p>Dear School Administrator,</p>
//             <p>The status of your school, <strong>${school_name}</strong>, has been updated to <strong>${status_approved}</strong>.</p>
//             <p>Best regards,<br>The Approval Team</p>
//           `;

//           try {
//             await sendEmail(school_email, subject, text, html);
//             console.log(`Email sent to ${school_email} for ${school_name}`);
//           } catch (emailError) {
//             console.error("Error sending email:", emailError);
//             // Note: Not failing the request if email fails, just logging
//           }

//           // ✅ Send SMS notification if school_contact_number exists
//           if (school_contact_number) {
//             const smsMessage = `Dear Administrator, the status of ${school_name} has been updated to ${status_approved}. Regards, Approval Team`;
//             try {
//               await sendSms(school_contact_number, smsMessage);
//               console.log(
//                 `SMS sent to ${school_contact_number} for ${school_name}`
//               );
//             } catch (smsError) {
//               console.error("Error sending SMS:", smsError);
//               // Note: Not failing the request if SMS fails, just logging
//             }
//           } else {
//             console.log(
//               `No contact number available for ${school_name}, SMS not sent`
//             );
//           }

//           return res.json({
//             message: `Status updated to ${status_approved} successfully`,
//           });
//         } catch (updateError) {
//           console.error("Error updating status:", updateError);
//           return res.status(500).json({ error: updateError.message });
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Error in updateStatusApproved:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
export const updateStatusApproved = async (req, res) => {
  try {
    const { id: userId } = req.user; // logged-in user's ID
    if (!userId) {
      return res.status(401).json({ error: "User ID is missing from token" });
    }

    const { id: schoolId } = req.params;
    const { status_approved } = req.body;

    if (!status_approved) {
      return res.status(400).json({ message: "status_approved is required" });
    }

    // ✅ Fetch user and role
    const sqlUser = `
      SELECT users.*, roles.role_name
      FROM users
      JOIN roles ON users.role = roles.id
      WHERE users.id = ?
    `;

    db.query(sqlUser, [userId], async (err, results) => {
      if (err) {
        console.error("Error querying user and role:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const user = results[0];

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { role_name, username } = user;

      // ✅ Role-based access control
      if (status_approved === "approved") {
        if (role_name !== "admin" && role_name !== "checker") {
          return res.status(403).json({
            message: "Only admin or checker can approve",
          });
        }
      } else if (status_approved === "rejected") {
        if (role_name !== "admin") {
          return res.status(403).json({
            message: "Only admin can reject",
          });
        }
      } else if (status_approved === "pending") {
        if (role_name !== "admin") {
          return res.status(403).json({
            message: "Only admin can set to pending",
          });
        }
      } else {
        return res.status(400).json({
          message: "Invalid status_approved value",
        });
      }

      // ✅ Update school status
      try {
        const result = await School.updateStatusApprovedById(
          schoolId,
          status_approved,
          username
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "School not found" });
        }

        // ✅ Send notifications only when status_approved is "approved"
        if (status_approved === "approved") {
          // ✅ Fetch school email, name, and contact number
          const sqlSchool = `
            SELECT school_email, school_name, school_contact_number
            FROM school
            WHERE id = ?
          `;

          db.query(sqlSchool, [schoolId], async (err, schoolResults) => {
            if (err) {
              console.error("Error querying school details:", err);
              return res.status(500).json({ error: "Database error" });
            }

            if (!schoolResults[0]) {
              return res.status(404).json({ message: "School not found" });
            }

            const { school_email, school_name, school_contact_number } =
              schoolResults[0];

            // ✅ Send email notification
            const subject = `School Status Update: Approved`;
            const text = `Dear School Administrator,\n\nThe status of your school, ${school_name}, has been updated to "approved".\n\nBest regards,\nThe Approval Team`;
            const html = `
              <h3>School Status Update</h3>
              <p>Dear School Administrator,</p>
              <p>The status of your school, <strong>${school_name}</strong>, has been updated to <strong>approved</strong>.</p>
              <p>Best regards,<br>The Approval Team</p>
            `;

            try {
              await sendEmail(school_email, subject, text, html);
              console.log(`Email sent to ${school_email} for ${school_name}`);
            } catch (emailError) {
              console.error("Error sending email:", emailError);
              // Note: Not failing the request if email fails, just logging
            }

            // ✅ Send SMS notification if school_contact_number exists
            if (school_contact_number) {
              const smsMessage = `Dear Administrator, the status of ${school_name} has been updated to approved. Regards, Approval Team`;
              try {
                await sendSms(school_contact_number, smsMessage);
                console.log(
                  `SMS sent to ${school_contact_number} for ${school_name}`
                );
              } catch (smsError) {
                console.error("Error sending SMS:", smsError);
                // Note: Not failing the request if SMS fails, just logging
              }
            } else {
              console.log(
                `No contact number available for ${school_name}, SMS not sent`
              );
            }
          });
        }

        return res.json({
          message: `Status updated to ${status_approved} successfully`,
        });
      } catch (updateError) {
        console.error("Error updating status:", updateError);
        return res.status(500).json({ error: updateError.message });
      }
    });
  } catch (error) {
    console.error("Error in updateStatusApproved:", error);
    res.status(500).json({ error: error.message });
  }
};
