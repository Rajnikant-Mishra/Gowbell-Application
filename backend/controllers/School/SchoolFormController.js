import Joi from "joi";
import School from "../../models/School/SchoolFormModel.js";
import { sendEmail } from "../../controllers/School/mailer.js";
import { sendSms } from "../../controllers/School/smsService.js";
import { db } from "../../config/db.js";
import User from "../../models/User/userModel.js";

// export const createSchool = async (req, res) => {
//   const { id } = req.user;
//   const data = req.body;

//   try {
//     // Ensure created_by and updated_by are set to the logged-in user's ID
//     const schoolData = {
//       ...data,
//       created_by: id,
//       updated_by: id,
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
//     if (schoolEmail && principalPhoneNumber && /^[+]?\d后来{10,15}$/.test(principalPhoneNumber)) {
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
//         sendSms(principalPhoneNumber, smsMessage)
//       ]);

//       // Success response with notifications sent
//       return res.status(201).json({
//         message: "School created, email and SMS sent successfully!",
//         id: schoolId,
//         school_code: schoolCode,
//       });
//     } else {
//       // Success response without notifications
//       return res.status(201).json({
//         message: "School created successfully, notifications not sent due to missing or invalid contact information",
//         id: schoolId,
//         school_code: schoolCode,
//       });
//     }
//   } catch (err) {
//     console.error("Error during school creation:", err);

//     if (err.response) {
//       return res
//         .status(500)
//         .json({
//           message: "Error in external service",
//           error: err.response.data,
//         });
//     }

//     res.status(500).json({ message: "An error occurred", error: err.message });
//   }
// };

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

//     // Determine status_approved based on user role or username
//     let statusApproved;
//     if (user) {
//       const roleLower = user.role ? user.role.toLowerCase() : "";
//       const isAdmin =
//         (user.username && user.username.toLowerCase().includes("admin")) ||
//         roleLower === "admin";

//       if (isAdmin) {
//         statusApproved = "approved";
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

//     // Ensure created_by and updated_by are set to the logged-in user's ID
//     const schoolData = {
//       ...data,
//       created_by: id,
//       updated_by: id,
//       status_approved: statusApproved,
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
//       });
//     } else {
//       // Success response without notifications
//       return res.status(201).json({
//         message:
//           "School created successfully, notifications not sent due to missing or invalid contact information",
//         id: schoolId,
//         school_code: schoolCode,
//         status_approved: schoolData.status_approved,
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
    const schoolName = data.school_name;
    const schoolEmail = data.school_email;
    const principalPhoneNumber = data.principal_contact_number;

    // Check if both email and phone are present
    if (
      schoolEmail &&
      principalPhoneNumber &&
      /^[+]?\d{10,15}$/.test(principalPhoneNumber)
    ) {
      // Prepare details for email and SMS
      const smsMessage = `Dear ${schoolName}, your registration with Gowbell Foundation was successful! Your School Code: ${schoolCode}`;

      const emailSubject = `School Registration Successful: ${schoolName}`;
      const emailText = `Dear ${schoolName}, your registration with Gowbell Foundation was successful. Your School Code: ${schoolCode}`;
      const emailHtml = `<p>Dear <strong>${schoolName}</strong>,</p>
                        <p>Your registration with Gowbell Foundation was successful.</p>
                        <p>Your School Code: <strong>${schoolCode}</strong>.</p>`;

      // Send notifications
      await Promise.all([
        sendEmail(schoolEmail, emailSubject, emailText, emailHtml),
        sendSms(principalPhoneNumber, smsMessage),
      ]);

      // Success response with notifications sent
      return res.status(201).json({
        message: "School created, email and SMS sent successfully!",
        id: schoolId,
        school_code: schoolCode,
        status_approved: schoolData.status_approved,
        approved_by: schoolData.approved_by, // Include approved_by in response
      });
    } else {
      // Success response without notifications
      return res.status(201).json({
        message:
          "School created successfully, notifications not sent due to missing or invalid contact information",
        id: schoolId,
        school_code: schoolCode,
        status_approved: schoolData.status_approved,
        approved_by: schoolData.approved_by, // Include approved_by in response
      });
    }
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
//   const { id } = req.user; // User ID from authenticated request
//   const schools = req.body; // Expecting an array of school objects

//   try {
//     // Add created_by and updated_by to each school object
//     const schoolsWithUserData = schools.map((school) => ({
//       ...school,
//       created_by: id,
//       updated_by: id,
//     }));

//     const results = await School.bulkCreate(schoolsWithUserData);

//     if (!results || results.affectedRows === 0) {
//       return res.status(500).json({ message: "Failed to insert schools" });
//     }

//     // Generate school codes and send confirmation emails/SMS
//     const schoolsWithCodes = schoolsWithUserData.map((school, index) => {
//       const { state, city } = school; // Extract state and city

//       const schoolCode = `${state}${city}${String(index + 1).padStart(2, "0")}`;

//       // Send confirmation email
//       const emailSubject = `School Registration Successful: ${school.school_name}`;
//       const emailText = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful. Your School Code: ${schoolCode}`;
//       const emailHtml = `<p>Dear <strong>${school.school_name}</strong>,</p>
//                          <p>Your registration with Gowbell Foundation was successful.</p>
//                          <p>Your School Code: <strong>${schoolCode}</strong>.</p>`;
//       sendEmail(school.school_email, emailSubject, emailText, emailHtml);

//       // Send confirmation SMS
//       const smsMessage = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful! Your School Code: ${schoolCode}`;
//       sendSms(school.principal_contact_number, smsMessage);

//       return {
//         ...school,
//         school_code: schoolCode,
//       };
//     });

//     res.status(201).json({
//       message: "Schools uploaded successfully",
//       insertedCount: results.affectedRows,
//       schools: schoolsWithCodes,
//     });
//   } catch (err) {
//     console.error("Error during bulk upload of schools:", err);
//     res.status(500).json({ message: "An error occurred", error: err.message });
//   }
// };

// export const bulkUploadSchools = async (req, res) => {
//   const { id } = req.user; // Authenticated user ID
//   const schools = req.body; // Array of school objects

//   try {
//     // Add created_by and updated_by to each school object
//     const schoolsWithUserData = schools.map((school) => ({
//       ...school,
//       created_by: id,
//       updated_by: id,
//     }));

//     const results = await School.bulkCreate(schoolsWithUserData);

//     if (!results || results.affectedRows === 0) {
//       return res.status(500).json({ message: "Failed to insert schools" });
//     }

//     // Combine school data with generated codes (assuming School.bulkCreate returns them)
//     const insertedSchools = results.schools || schoolsWithUserData; // Fallback if no returned school list

//     // Loop through and send notifications only if both email and phone are present
//     insertedSchools.forEach((school) => {
//       if (school.school_email && school.principal_contact_number) {
//         const emailSubject = `School Registration Successful: ${school.school_name}`;
//         const emailText = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful. Your School Code: ${school.school_code}`;
//         const emailHtml = `
//           <p>Dear <strong>${school.school_name}</strong>,</p>
//           <p>Your registration with Gowbell Foundation was successful.</p>
//           <p>Your School Code: <strong>${school.school_code}</strong>.</p>
//         `;

//         sendEmail(school.school_email, emailSubject, emailText, emailHtml);

//         const smsMessage = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful! Your School Code: ${school.school_code}`;
//         sendSms(school.principal_contact_number, smsMessage);
//       }
//     });

//     res.status(201).json({
//       message: "Schools uploaded successfully",
//       insertedCount: results.affectedRows,
//       schools: insertedSchools,
//     });
//   } catch (err) {
//     console.error("Error during bulk upload of schools:", err);
//     res.status(500).json({ message: "An error occurred", error: err.message });
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

    results.schools.forEach((school) => {
      if (school.school_email && school.principal_contact_number) {
        const subject = `School Registration Successful: ${school.school_name}`;
        const text = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful. School Code: ${school.school_code}`;
        const html = `
          <p>Dear <strong>${school.school_name}</strong>,</p>
          <p>Registration successful with Gowbell Foundation.</p>
          <p>Your School Code is <strong>${school.school_code}</strong>.</p>
        `;

        sendEmail(school.school_email, subject, text, html);
        sendSms(school.principal_contact_number, text);
      }
    });

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

//pagibnation school get
export const getAllSchools = (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  School.getAll(page, limit, (err, data) => {
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
//     const { id } = req.params;
//     const { status_approved } = req.body;

//     if (!status_approved) {
//       return res.status(400).json({ message: "status_approved is required" });
//     }

//     const result = await School.updateStatusApprovedById(id, status_approved);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "School not found" });
//     }

//     res.json({ message: "status_approved updated successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

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

//     // ✅ Fetch the user by ID from DB
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const { username } = user;

//     // ✅ Role-based access control
//     if (username !== "admin") {
//       return res.status(403).json({
//         message: "Only admin or checker can approved",
//       });
//     }

//     const result = await School.updateStatusApprovedById(schoolId, status_approved);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "School not found" });
//     }

//     res.json({ message: "status_approved updated successfully" });
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
    const sql = `
      SELECT users.*, roles.role_name
      FROM users
      JOIN roles ON users.role = roles.id
      WHERE users.id = ?
    `;

    db.query(sql, [userId], async (err, results) => {
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
            message: "Only admin can rejected",
          });
        }
      } else if (status_approved === "pending") {
        if (role_name !== "admin") {
          return res.status(403).json({
            message: "Only admin can pending",
          });
        }
      } else {
        return res.status(400).json({
          message: "Invalid status_approved value",
        });
      }

      // ✅ Call your existing model function
      try {
        const result = await School.updateStatusApprovedById(
          schoolId,
          status_approved,
          username
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "School not found" });
        }

        return res.json({ message: `Status updated to ${status_approved} successfully` });
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

