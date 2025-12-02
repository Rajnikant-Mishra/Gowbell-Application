import Joi from "joi";
import School from "../../models/School/SchoolFormModel.js";
import { sendEmail } from "../../controllers/School/mailer.js";
import { sendSms } from "../../controllers/School/smsService.js";
import { db } from "../../config/db.js";
import User from "../../models/User/userModel.js";
import { logActivity } from "../../models/dashboard/activityModel.js";

export const createSchool = async (req, res) => {
  const { id } = req.user;
  const data = req.body;

  try {
    // Step 1: Get user info
    const sqlGetUser = `SELECT username, role FROM users WHERE id = ?`;
    const [user] = await new Promise((resolve, reject) => {
      db.query(sqlGetUser, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Step 2: Determine approval status
    let statusApproved;
    let approvedBy = null;
    if (user) {
      const roleLower = user.role ? user.role.toLowerCase() : "";
      const isAdmin =
        (user.username && user.username.toLowerCase().includes("admin")) ||
        roleLower === "admin";

      if (isAdmin) {
        statusApproved = "approved";
        approvedBy = user.username;
      } else if (roleLower === "maker") {
        statusApproved = "pending";
      } else if (roleLower === "checker") {
        statusApproved = "approved";
      } else {
        statusApproved = "pending";
      }
    } else {
      statusApproved = "pending";
    }

    // Step 3: Prepare final data
    const schoolData = {
      ...data,
      created_by: id,
      updated_by: id,
      status_approved: statusApproved,
      approved_by: approvedBy,
    };

    // Step 4: Create school
    const results = await School.create(schoolData);

    if (!results || !results.insertId) {
      return res
        .status(500)
        .json({ message: "School creation failed, no ID returned" });
    }

    const schoolId = results.insertId;
    const schoolCode = results.school_code;

    // ✅ Step 5: Log activity
    logActivity({
      user_id: id,
      activity: `School ${data.school_name} has been created`,
      data: { schoolId, schoolCode, statusApproved },
      ip_address: req.ip || req.connection?.remoteAddress,
    });

    // ✅ Success response
    return res.status(201).json({
      message: "School created successfully",
      id: schoolId,
      school_code: schoolCode,
      status_approved: schoolData.status_approved,
      approved_by: schoolData.approved_by,
    });
  } catch (err) {
    console.error("Error during school creation:", err);

    // ✅ Step 6: Handle duplicate validation cleanly
    if (err.message && err.message.toLowerCase().includes("already exists")) {
      return res.status(409).json({
        message: "Duplicate entry",
        error: err.message,
      });
    }

    if (err.response) {
      return res.status(500).json({
        message: "Error in external service",
        error: err.response.data,
      });
    }

    res.status(500).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};

export const bulkUploadSchools = async (req, res) => {
  const { id } = req.user;
  const schools = req.body;

  try {
    // Attach created_by and updated_by
    const schoolsWithUserData = schools.map((s) => ({
      ...s,
      created_by: id,
      updated_by: id,
    }));

    const results = await School.bulkCreate(schoolsWithUserData);

    // ✅ Successful upload (even if partial)
    res.status(201).json({
      message: "Schools uploaded successfully",
      insertedCount: results.affectedRows || 0,
      schools: results.schools || [],
      errors: results.errors || [],
    });
  } catch (err) {
    console.error("Bulk upload error:", err);

    // ✅ Friendly messages for known validation issues
    let statusCode = 400;
    let message = "Validation error during bulk upload";

    // handle known validation messages
    if (
      err.message?.includes("Duplicate email") ||
      err.message?.includes("Missing required fields") ||
      err.message?.includes("Invalid")
    ) {
      statusCode = 400;
      message = err.message;
    } else {
      statusCode = 500;
      message = "Server error during bulk upload";
    }

    res.status(statusCode).json({
      message,
      errors: err.errors || [{ error: err.message || "Unknown error" }],
    });
  }
};

// Update school
export const updateSchool = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  School.update(id, data, (err, results) => {
    if (err) {
      if (
        err.message &&
        err.message.includes(
          "A school with the same name and area already exists"
        )
      ) {
        return res.status(409).json({ error: err.message });
      }

      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "School not found" });
    }

    // ✅ Log update action
    logActivity({
      user_id: userId,
      activity: `School ${data.school_name || id} has been updated`,
      data: { schoolId: id, changes: data },
      ip_address: req.ip || req.connection?.remoteAddress,
    });

    res.status(200).json({
      message: "School updated successfully",
      data: results,
    });
  });
};

// Get all schools
export const getAll = (req, res) => {
  School.getAllSchool((err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

//pagination get all
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

export const deleteSchool = (req, res) => {
  const id = req.params.id;
  const userId = req.user?.id;
  const userName = req.user?.name || "Unknown User";

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  School.delete(id, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });

    // ✅ Log activity safely
    try {
      logActivity({
        user_id: userId,
        user_name: userName,
        activity: `School has been deleted`,
        data: { schoolId: id },
        ip_address: req.ip || req.socket?.remoteAddress || null,
      });
    } catch (logErr) {
      console.error("Activity Log Error:", logErr.message);
    }

    res.status(200).json({ message: "School deleted successfully" });
  });
};

// Filter schools by location country, state., district, city
// export const filterByLocation = (req, res) => {
//   const { country, state, district, city } = req.query;

//   const filters = {
//     country: country || null,
//     state: state || null,
//     district: district || null,
//     city: city || null,
//   };

//   School.getSchoolCountByLocation(filters)
//     .then((schoolData) => {
//       if (schoolData.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "No schools found for the selected filters",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         total_schools: schoolData.reduce(
//           (sum, item) => sum + item.school_count,
//           0
//         ),
//         data: schoolData.map((item) => ({
//           country: item.country_name,
//           state: item.state_name,
//           district: item.district_name,
//           city: item.city_name,
//           school_count: item.school_count,
//           schools: item.school_names ? item.school_names.split(",") : [],
//         })),
//       });
//     })
//     .catch((err) => {
//       console.error("Error fetching school count:", err);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch school count",
//         error: err.message,
//       });
//     });
// };

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

      // Determine grouping level dynamically
      let groupingLevel = "country";
      if (city) groupingLevel = "city";
      else if (district) groupingLevel = "district";
      else if (state) groupingLevel = "state";

      // Prepare formatted response
      const groupedData = schoolData.map((item) => ({
        country: item.country_name,
        state: item.state_name,
        district: item.district_name,
        city: item.city_name,
        school_count: item.school_count,
        schools: item.school_names ? item.school_names.split(",") : [],
      }));

      res.status(200).json({
        success: true,
        level: groupingLevel,
        total_schools: schoolData.reduce(
          (sum, item) => sum + item.school_count,
          0
        ),
        data: groupedData,
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
///////-----------------------
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

// Filter schools-id by location
export const filterschoolIDByLocation = (req, res) => {
  const { country, state, district, city } = req.query;

  const filters = {
    country: country || null,
    state: state || null,
    district: district || null,
    city: city || null,
  };

  School.getSchoolIdByLocation(filters)
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
          schools: item.school_info
            ? item.school_info.split(",").map((info) => {
                const [id, ...nameParts] = info.split(":");
                return {
                  id: parseInt(id),
                  name: nameParts.join(":"), // Rejoin name parts in case the name contains colons
                };
              })
            : [],
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

//Report-school section
export const getReportSchoolById = (req, res) => {
  const schoolId = req.params.id;

  if (!schoolId) {
    return res.status(400).json({ error: "School ID or code is required" });
  }

  School.getByReportId(schoolId, (err, school) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // If you stored classes as JSON string, parse them before sending
    try {
      school.classes = JSON.parse(school.classes || "[]");
    } catch (e) {
      school.classes = [];
    }

    res.status(200).json({ success: true, data: school });
  });
};

//fees of schhol collection
export const getReportSchoolByIdCount = (req, res) => {
  let schoolOrCity = req.params.id?.trim();
  let sessionId = req.query.session_id?.trim(); // optional query param

  if (!schoolOrCity) {
    return res
      .status(400)
      .json({ error: "School ID, code, or city is required" });
  }

  School.getByReportIdWithStudentCount(
    schoolOrCity,
    sessionId,
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "School(s) not found" });
      }

      res.status(200).json({ success: true, data: result });
    }
  );
};
