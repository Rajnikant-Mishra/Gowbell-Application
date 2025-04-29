import Joi from "joi";
import School from "../../models/School/SchoolFormModel.js";
import { sendEmail } from "../../controllers/School/mailer.js";
import { sendSms } from "../../controllers/School/smsService.js";


export const createSchool = async (req, res) => {
  const { id } = req.user; // Corrected: Removed `.id` since `req.user` should directly contain the ID
  const data = req.body;

  try {
    // Ensure created_by and updated_by are set to the logged-in user's ID
    const schoolData = {
      ...data,
      created_by: id,
      updated_by: id,
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

    // Prepare details for email and SMS
    const schoolName = data.school_name;
    const schoolEmail = data.school_email;
    const principalPhoneNumber = data.principal_contact_number;
    const smsMessage = `Dear ${schoolName}, your registration with Gowbell Foundation was successful! Your School Code: ${schoolCode}`;

    const emailSubject = `School Registration Successful: ${schoolName}`;
    const emailText = `Dear ${schoolName}, your registration with Gowbell Foundation was successful. Your School Code: ${schoolCode}`;
    const emailHtml = `<p>Dear <strong>${schoolName}</strong>,</p>
                       <p>Your registration with Gowbell Foundation was successful.</p>
                       <p>Your School Code: <strong>${schoolCode}</strong>.</p>`;

    // Send confirmation email
    await sendEmail(schoolEmail, emailSubject, emailText, emailHtml);

    // Validate and send SMS
    if (
      !principalPhoneNumber ||
      !/^[+]?\d{10,15}$/.test(principalPhoneNumber)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid principal contact number" });
    }
    await sendSms(principalPhoneNumber, smsMessage);

    // Success response
    res.status(201).json({
      message: "School created, email sent successfully, and SMS sent!",
      id: schoolId,
      school_code: schoolCode,
    });
  } catch (err) {
    console.error("Error during school creation:", err);

    if (err.response) {
      return res
        .status(500)
        .json({
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

export const bulkUploadSchools = async (req, res) => {
  const { id } = req.user; // Authenticated user ID
  const schools = req.body; // Array of school objects

  try {
    // Add created_by and updated_by to each school object
    const schoolsWithUserData = schools.map((school) => ({
      ...school,
      created_by: id,
      updated_by: id,
    }));

    const results = await School.bulkCreate(schoolsWithUserData);

    if (!results || results.affectedRows === 0) {
      return res.status(500).json({ message: "Failed to insert schools" });
    }

    // Combine school data with generated codes (assuming School.bulkCreate returns them)
    const insertedSchools = results.schools || schoolsWithUserData; // Fallback if no returned school list

    // Loop through and send notifications only if both email and phone are present
    insertedSchools.forEach((school) => {
      if (school.school_email && school.principal_contact_number) {
        const emailSubject = `School Registration Successful: ${school.school_name}`;
        const emailText = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful. Your School Code: ${school.school_code}`;
        const emailHtml = `
          <p>Dear <strong>${school.school_name}</strong>,</p>
          <p>Your registration with Gowbell Foundation was successful.</p>
          <p>Your School Code: <strong>${school.school_code}</strong>.</p>
        `;

        sendEmail(school.school_email, emailSubject, emailText, emailHtml);

        const smsMessage = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful! Your School Code: ${school.school_code}`;
        sendSms(school.principal_contact_number, smsMessage);
      }
    });

    res.status(201).json({
      message: "Schools uploaded successfully",
      insertedCount: results.affectedRows,
      schools: insertedSchools,
    });
  } catch (err) {
    console.error("Error during bulk upload of schools:", err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};



// Get all schools
export const getAllSchools = (req, res) => {
  School.getAll((err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
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
      city: city || null
  };

  School.getSchoolCountByLocation(filters)
      .then(schoolData => {
          if (schoolData.length === 0) {
              return res.status(404).json({
                  success: false,
                  message: "No schools found for the selected filters"
              });
          }

          res.status(200).json({
              success: true,
              total_schools: schoolData.reduce((sum, item) => sum + item.school_count, 0),
              data: schoolData.map(item => ({
                  country: item.country_name,
                  state: item.state_name,
                  district: item.district_name,
                  city: item.city_name,
                  school_count: item.school_count,
                  schools: item.school_names ? item.school_names.split(",") : []
              }))
          });
      })
      .catch(err => {
          console.error('Error fetching school count:', err);
          res.status(500).json({
              success: false,
              message: 'Failed to fetch school count',
              error: err.message
          });
      });
};




