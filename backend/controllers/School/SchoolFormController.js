import Joi from "joi";
import School from "../../models/School/SchoolFormModel.js";
import { sendEmail } from "../../controllers/School/mailer.js";
import { sendSms } from '../../controllers/School/smsService.js'; 

// Dynamic Field Validation Configuration for School
const schoolValidationSchema = Joi.object({
  board: Joi.string()
    .valid("CBSE", "ICSE", "State", "International")
    .required()
    .messages({
      "any.only": "Board must be required",
      "string.empty": "Board is required",
    }),
  school_name: Joi.string().required().messages({
    "string.empty": "School name is required",
  }),
  school_email: Joi.string().email().required().messages({
    "string.email": "A valid school email is required",
    "string.empty": "School email is required",
  }),
  school_contact_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base":
        "School contact number must be a valid 10-digit number",
      "string.empty": "School contact number is required",
    }),
  state: Joi.string().required().messages({
    "string.empty": "State is required",
  }),
  district: Joi.string().required().messages({
    "string.empty": "District is required",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City is required",
  }),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Pincode must be a valid 6-digit number",
      "string.empty": "Pincode is required",
    }),
  principal_name: Joi.string().required().messages({
    "string.empty": "Principal name is required",
  }),
 
  principal_contact_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Principal contact number must be a valid 10-digit number",
      "string.empty": "Principal contact number is required",
    }),
  principal_whatsapp: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Principal WhatsApp must be a valid 10-digit number",
      "string.empty": "Principal WhatsApp is required",
    }),
  vice_principal_name: Joi.string().optional().allow("").messages({
    "string.empty": "Vice Principal name can be empty",
  }),
 
  vice_principal_contact_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base":
        "Vice Principal contact number must be a valid 10-digit number",
    }),
  vice_principal_whatsapp: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base":  
        "Vice Principal WhatsApp must be a valid 10-digit number",
    }),

    student_strength: Joi.number()
    .integer()
    .required()
    .messages({
      "any.required": "Student strength is a required field.",
      "number.base": "Student strength must be a valid number.",
      "number.integer": "Student strength must be an integer.",
      
    }),
  
    classes: Joi.array()
    .items(Joi.string().required())
    .required()
    .messages({
       "any.required": "Classes are required.",
      "array.base": "Classes must be an array of strings.",
      "array.includesRequiredUnknowns": "Each class must be a valid string.",
     
    }),
  
});



// export const createSchool = async (req, res) => {
//   const { error } = schoolValidationSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }

//   const data = req.body;

//   try {
//     // Create school in the database
//     const results = await School.create(data);

//     // Check if results is defined and has insertId
//     if (!results || !results.insertId) {
//       return res.status(500).json({ message: "School creation failed, no ID returned" });
//     }

//     const schoolId = results.insertId;

//     // Prepare details for email and SMS
//     const schoolName = data.school_name;
//     const schoolEmail = data.school_email;
//     const principalEmail = data.principal_email;
//     const principalPhoneNumber = data.principal_contact_number;
//     const smsMessage = `Dear ${schoolName}, your registration with Gowbell Foundation was successful!`;
    
//     const emailSubject = `School Registration Successful: ${schoolName}`;
//     const emailText = `Dear ${schoolName}, your registration with Gowbell Foundation was successfully.`;
//     const emailHtml = `<p>Dear <strong>${schoolName}</strong>,</p>
//                        <p>Your registration with Gowbell Foundation was successfully.</strong>.</p>`;
    
//     // Send confirmation email
//     await sendEmail(principalEmail, emailSubject, emailText, emailHtml);
    
//     // Validate and send SMS
//     if (!principalPhoneNumber || !/^\+?\d{10,15}$/.test(principalPhoneNumber)) {
//       return res.status(400).json({ message: "Invalid principal contact number" });
//     }
//     await sendSms(principalPhoneNumber, smsMessage);

//     // Success response
//     res.status(201).json({
//       message: "School created, email sent successfully, and SMS sent!",
//       id: schoolId, // Use the `insertId` returned by the `create` method
//     });
//   } catch (err) {
//     console.error("Error during school creation:", err);

//     // Check if the error occurred while sending email or SMS
//     if (err.response) {
//       return res.status(500).json({ message: "Error in external service", error: err.response.data });
//     }

//     res.status(500).json({ message: "An error occurred", error: err.message });
//   }
// };

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
//       return res.status(500).json({ message: "School creation failed, no ID returned" });
//     }

//     const schoolId = results.insertId;
//     const schoolCode = results.school_code; // Get the generated school_code

//     // Prepare details for email and SMS
//     const schoolName = data.school_name;
//     const principalEmail = data.principal_email;
//     const principalPhoneNumber = data.principal_contact_number;
//     const smsMessage = `Dear ${schoolName}, your registration with Gowbell Foundation was successful! Your School Code: ${schoolCode}`;
    
//     const emailSubject = `School Registration Successful: ${schoolName}`;
//     const emailText = `Dear ${schoolName}, your registration with Gowbell Foundation was successful. Your School Code: ${schoolCode}`;
//     const emailHtml = `<p>Dear <strong>${schoolName}</strong>,</p>
//                        <p>Your registration with Gowbell Foundation was successful.</p>
//                        <p>Your School Code: <strong>${schoolCode}</strong>.</p>`;
    
//     // Send confirmation email
//     await sendEmail(principalEmail, emailSubject, emailText, emailHtml);
    
//     // Validate and send SMS
//     if (!principalPhoneNumber || !/^\+?\d{10,15}$/.test(principalPhoneNumber)) {
//       return res.status(400).json({ message: "Invalid principal contact number" });
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
//       return res.status(500).json({ message: "Error in external service", error: err.response.data });
//     }

//     res.status(500).json({ message: "An error occurred", error: err.message });
//   }
// };

export const createSchool = async (req, res) => {
  const { error } = schoolValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const data = req.body;

  try {
    // Create school in the database
    const results = await School.create(data);

    if (!results || !results.insertId) {
      return res.status(500).json({ message: "School creation failed, no ID returned" });
    }

    const schoolId = results.insertId;
    const schoolCode = results.school_code; // Get the generated school_code

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
    if (!principalPhoneNumber || !/^\+?\d{10,15}$/.test(principalPhoneNumber)) {
      return res.status(400).json({ message: "Invalid principal contact number" });
    }
    await sendSms(principalPhoneNumber, smsMessage);

    // Success response
    res.status(201).json({
      message: "School created, email sent successfully, and SMS sent!",
      id: schoolId,
      school_code: schoolCode, // Return the school_code in the response
    });
  } catch (err) {
    console.error("Error during school creation:", err);

    if (err.response) {
      return res.status(500).json({ message: "Error in external service", error: err.response.data });
    }

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
// export const updateSchool = (req, res) => {
//   const id = req.params.id;
//   const { error } = schoolValidationSchema.validate(req.body);
//   if (error) return res.status(400).json({ error: error.details[0].message });

//   const data = req.body;
//   School.update(id, data, (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.status(200).json({ message: "School updated" });
//   });
// };
export const updateSchool = (req, res) => {
  const id = req.params.id;

  // Validate request body
  const { error } = schoolValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message); // Collect all error messages
    return res.status(400).json({ message: "Validation error", errors: messages });
  }

  const data = req.body;

  // Update school in the database (replace `School.update` with your database query)
  School.update(id, data, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json({ message: "School updated successfully", data: results });
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
