import Joi from "joi";
import School from "../../models/School/SchoolFormModel.js";
import { sendEmail } from "../../controllers/School/mailer.js";
import { sendSms } from "../../controllers/School/smsService.js";


// export const createSchool = async (req, res) => {
//   const { error } = schoolValidationSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }

//   const data = req.body;

//   try {
//     // Create school in the database
//     const results = await School.create(data);

//     if (!results || !results.insertId) {
//       return res
//         .status(500)
//         .json({ message: "School creation failed, no ID returned" });
//     }

//     const schoolId = results.insertId;
//     const schoolCode = results.school_code; // Get the generated school_code

//     // Prepare details for email and SMS
//     const schoolName = data.school_name;
//     const schoolEmail = data.school_email;
//     const principalPhoneNumber = data.principal_contact_number;
//     const smsMessage = `Dear ${schoolName}, your registration with Gowbell Foundation was successful! Your School Code: ${schoolCode}`;

//     const emailSubject = `School Registration Successful: ${schoolName}`;
//     const emailText = `Dear ${schoolName}, your registration with Gowbell Foundation was successful. Your School Code: ${schoolCode}`;
//     const emailHtml = `<p>Dear <strong>${schoolName}</strong>,</p>
//                        <p>Your registration with Gowbell Foundation was successful.</p>
//                        <p>Your School Code: <strong>${schoolCode}</strong>.</p>`;

//     // Send confirmation email
//     await sendEmail(schoolEmail, emailSubject, emailText, emailHtml);

//     // Validate and send SMS
//     if (!principalPhoneNumber || !/^\+?\d{10,15}$/.test(principalPhoneNumber)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid principal contact number" });
//     }
//     await sendSms(principalPhoneNumber, smsMessage);

//     // Success response
//     res.status(201).json({
//       message: "School created, email sent successfully, and SMS sent!",
//       id: schoolId,
//       school_code: schoolCode, // Return the school_code in the response
//     });
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
export const createSchool = async (req, res) => {
  const data = req.body;

  try {
    // Create school in the database
    const results = await School.create(data);

    if (!results || !results.insertId) {
      return res.status(500).json({ message: "School creation failed, no ID returned" });
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
    if (!principalPhoneNumber || !/^[+]?\d{10,15}$/.test(principalPhoneNumber)) {
      return res.status(400).json({ message: "Invalid principal contact number" });
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
      return res.status(500).json({ message: "Error in external service", error: err.response.data });
    }

    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};


// Bulk Upload Schools
// export const bulkUploadSchools = async (req, res) => {
//   const schools = req.body; // Expecting an array of school objects

//   if (!Array.isArray(schools) || schools.length === 0) {
//     return res.status(400).json({ message: "No school data provided" });
//   }

//   // Validate each school entry
//   const validationErrors = [];
//   const validSchools = schools.filter((school, index) => {
//     const { error } = schoolValidationSchema.validate(school, {
//       abortEarly: false,
//     });
//     if (error) {
//       validationErrors.push({
//         index,
//         errors: error.details.map((detail) => detail.message),
//       });
//       return false;
//     }
//     return true;
//   });

//   if (validationErrors.length > 0) {
//     return res.status(400).json({
//       message: "Validation errors in some schools",
//       errors: validationErrors,
//     });
//   }

//   try {
//     const results = await School.bulkCreate(validSchools);

//     if (!results || results.affectedRows === 0) {
//       return res.status(500).json({ message: "Failed to insert schools" });
//     }

//     // Generate school codes and send confirmation emails/SMS
//     const schoolsWithCodes = validSchools.map((school, index) => {
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
  const schools = req.body; // Expecting an array of school objects

  try {
    const results = await School.bulkCreate(schools);

    if (!results || results.affectedRows === 0) {
      return res.status(500).json({ message: "Failed to insert schools" });
    }

    // Generate school codes and send confirmation emails/SMS
    const schoolsWithCodes = schools.map((school, index) => {
      const { state, city } = school; // Extract state and city

      const schoolCode = `${state}${city}${String(index + 1).padStart(2, "0")}`;

      // Send confirmation email
      const emailSubject = `School Registration Successful: ${school.school_name}`;
      const emailText = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful. Your School Code: ${schoolCode}`;
      const emailHtml = `<p>Dear <strong>${school.school_name}</strong>,</p>
                         <p>Your registration with Gowbell Foundation was successful.</p>
                         <p>Your School Code: <strong>${schoolCode}</strong>.</p>`;
      sendEmail(school.school_email, emailSubject, emailText, emailHtml);

      // Send confirmation SMS
      const smsMessage = `Dear ${school.school_name}, your registration with Gowbell Foundation was successful! Your School Code: ${schoolCode}`;
      sendSms(school.principal_contact_number, smsMessage);

      return {
        ...school,
        school_code: schoolCode,
      };
    });

    res.status(201).json({
      message: "Schools uploaded successfully",
      insertedCount: results.affectedRows,
      schools: schoolsWithCodes,
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
