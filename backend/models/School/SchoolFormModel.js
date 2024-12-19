import { db } from "../../config/db.js";

const School = {
  // Get all schools
  getAll: (callback) => {
    const sql = "SELECT * FROM school"; // Ensure correct SQL query
    db.query(sql, callback);
  },

  // Get a school by ID
  getById: (id, callback) => {
    const sql = "SELECT * FROM school WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Create a new school
  //   create: (data) => {
  //     return new Promise((resolve, reject) => {
  //       // Ensure 'classes' is a valid JSON string
  //       const classes = JSON.stringify(data.classes); // Convert classes to JSON string

  //       const sql = `
  //   INSERT INTO school (
  //     board, school_name, school_email, school_contact_number,
  //     state, district, city, pincode, principal_name, principal_email,
  //     principal_contact_number, principal_whatsapp, vice_principal_name,
  //     vice_principal_email, vice_principal_contact_number,
  //     vice_principal_whatsapp, student_strength, classes
  //   )
  //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  // `;

  //       const values = [
  //         data.board,
  //         data.school_name,
  //         data.school_email,
  //         data.school_contact_number,
  //         data.state,
  //         data.district,
  //         data.city,
  //         data.pincode,
  //         data.principal_name,
  //         data.principal_email,
  //         data.principal_contact_number,
  //         data.principal_whatsapp,
  //         data.vice_principal_name,
  //         data.vice_principal_email,
  //         data.vice_principal_contact_number,
  //         data.vice_principal_whatsapp,
  //         data.student_strength,
  //         JSON.stringify(data.classes || []), // Serialize `classes` as JSON
  //       ];

  //       db.query(sql, values, (err, results) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(results);
  //         }
  //       });
  //     });
  //   },

  // create: (data) => {
  //   return new Promise((resolve, reject) => {
  //     // Generate a unique school_code dynamically
  //     const schoolCode = `${data.school_name.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-4)}`;

    

  //     const sql = `
  //     INSERT INTO school (
  //       board, school_name, school_email, school_contact_number, 
  //       state, district, city, pincode, principal_name, principal_email, 
  //       principal_contact_number, principal_whatsapp, vice_principal_name, 
  //       vice_principal_email, vice_principal_contact_number, 
  //       vice_principal_whatsapp, student_strength, classes, school_code
  //     ) 
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //   `;

  //     const values = [
  //       data.board,
  //       data.school_name,
  //       data.school_email,
  //       data.school_contact_number,
  //       data.state,
  //       data.district,
  //       data.city,
  //       data.pincode,
  //       data.principal_name,
  //       data.principal_email,
  //       data.principal_contact_number,
  //       data.principal_whatsapp,
  //       data.vice_principal_name,
  //       data.vice_principal_email,
  //       data.vice_principal_contact_number,
  //       data.vice_principal_whatsapp,
  //       data.student_strength,
  //       JSON.stringify(data.classes || []), // Serialize `classes` as JSON
  //       schoolCode, // Add the generated school_code
  //     ];

  //     db.query(sql, values, (err, results) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve({ ...results, school_code: schoolCode }); // Include school_code in response
  //       }
  //     });
  //   });
  // },

  create: (data) => {
    return new Promise((resolve, reject) => {
      // Query to get the latest school code from the database
      const sqlGetLatestCode = `SELECT school_code FROM school ORDER BY school_code DESC LIMIT 1`;
  
      db.query(sqlGetLatestCode, (err, results) => {
        if (err) {
          reject(err);
        } else {
          let schoolCode;
          if (results.length > 0) {
            // Extract the numeric part of the latest school code
            const latestCode = results[0].school_code;
            const numericPart = parseInt(latestCode.substring(3), 10); // Remove the prefix "ODI"
            const newNumericPart = numericPart + 1;
  
            // Generate new school code with leading zeros
            schoolCode = `ODI${String(newNumericPart).padStart(6, '0')}`;
          } else {
            // If no school code exists, start with the first code
            schoolCode = `ODI000001`;
          }
  
          // SQL for inserting the new school data
          const sql = `
            INSERT INTO school (
              board, school_name, school_email, school_contact_number, 
              state, district, city, pincode, principal_name, 
              principal_contact_number, principal_whatsapp, vice_principal_name, 
              vice_principal_contact_number, 
              vice_principal_whatsapp, student_strength, classes, school_code
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
  
          const values = [
            data.board,
            data.school_name,
            data.school_email,
            data.school_contact_number,
            data.state,
            data.district,
            data.city,
            data.pincode,
            data.principal_name,
            
            data.principal_contact_number,
            data.principal_whatsapp,
            data.vice_principal_name,
           
            data.vice_principal_contact_number,
            data.vice_principal_whatsapp,
            data.student_strength,
            JSON.stringify(data.classes || []), // Serialize `classes` as JSON
            schoolCode, // Add the generated school_code
          ];
  
          // Insert the new school data
          db.query(sql, values, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve({ ...results, school_code: schoolCode }); // Include school_code in response
            }
          });
        }
      });
    });
  },
  

  // Update a school's details
  update: (id, data, callback) => {
    // Ensure 'classes' is a valid JSON string
    const classes = JSON.stringify(data.classes); // Converting to JSON string
    const sql =
      "UPDATE school SET board = ?,  school_name = ?, school_email = ?, school_contact_number = ?, state = ?, district = ?, city = ?, pincode = ?, principal_name = ?,  principal_contact_number = ?, principal_whatsapp = ?, vice_principal_name = ?,  vice_principal_contact_number = ?, vice_principal_whatsapp = ?, student_strength = ?, classes = ? WHERE id = ?";

    const values = [
      data.board,
  
      data.school_name,
      data.school_email,
      data.school_contact_number,
      data.state,
      data.district,
      data.city,
      data.pincode,
      data.principal_name,
      
      data.principal_contact_number,
      data.principal_whatsapp,
      data.vice_principal_name,
      
      data.vice_principal_contact_number,
      data.vice_principal_whatsapp,
      data.student_strength,
      classes, // Update classes as JSON string
      id,
    ];

    db.query(sql, values, callback);
  },

  // Delete a school by ID
  delete: (id, callback) => {
    const sql = "DELETE FROM school WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

export default School;
