import { db } from "../../config/db.js";

const School = {
  // Get all schools
  getAll: (callback) => {
    const sql = `
      SELECT 
        s.*, 
        st.name AS state_name, 
        d.name AS district_name, 
        c.name AS city_name
      FROM school s
      LEFT JOIN states st ON s.state = st.id
      LEFT JOIN districts d ON s.district = d.id
      LEFT JOIN cities c ON s.city = c.id
      ORDER BY s.id DESC
    `;
    db.query(sql, callback);
  },

  // Get a school by ID
  getById: (id, callback) => {
    const sql = "SELECT * FROM school WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      const { state, city } = data; // Get state and city codes from input

      if (!state || !city) {
        return reject(new Error("State code and city code are required"));
      }

      // Query to get the latest school code for the given state and city
      const sqlGetLatestCode = `
        SELECT school_code FROM school 
        WHERE school_code LIKE '${state}${city}%' 
        ORDER BY school_code DESC LIMIT 1
      `;

      db.query(sqlGetLatestCode, (err, results) => {
        if (err) {
          reject(err);
        } else {
          let schoolCode;
          if (results.length > 0) {
            // Extract the numeric part of the latest school code
            const latestCode = results[0].school_code;
            const numericPart = parseInt(latestCode.substring(4), 10); // Get the incremental number
            const newNumericPart = numericPart + 1;
            schoolCode = `${state}${city}${String(newNumericPart).padStart(
              2,
              "0"
            )}`;
          } else {
            // If no school exists for the state & city, start from '001'
            schoolCode = `${state}${city}01`;
          }

          // SQL for inserting the new school data
          const sql = `
            INSERT INTO school (
              board, school_name, school_email, school_contact_number, school_landline_number,
              state, district, city, pincode, principal_name, 
              principal_contact_number, principal_whatsapp, vice_principal_name, 
              vice_principal_contact_number, vice_principal_whatsapp, student_strength, 
              classes, status, school_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values = [
            data.board,
            data.school_name,
            data.school_email,
            data.school_contact_number,
            data.school_landline_number || null,
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
            JSON.stringify(data.classes || []) || null,
            data.status || null,
            schoolCode, // Newly generated school_code
          ];

          // Insert the new school data
          db.query(sql, values, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve({ ...results, school_code: schoolCode });
            }
          });
        }
      });
    });
  },

  // Bulk Create Schools

  // bulkCreate: (schools) => {
  //   return new Promise((resolve, reject) => {
  //     // Function to generate unique school codes
  //     const generateSchoolCode = (state, city) => {
  //       return new Promise((resolve, reject) => {
  //         const sqlGetLatestCode = `
  //       SELECT school_code FROM school 
  //       WHERE school_code LIKE '${state}${city}%' 
  //       ORDER BY school_code DESC LIMIT 1
  //     `;

  //         db.query(sqlGetLatestCode, (err, results) => {
  //           if (err) {
  //             return reject(err);
  //           }

  //           let schoolCode;
  //           if (results.length > 0) {
  //             const latestCode = results[0].school_code;
  //             const numericPart = parseInt(latestCode.substring(4), 10);
  //             const newNumericPart = numericPart + 1;
  //             schoolCode = `${state}${city}${String(newNumericPart).padStart(
  //               2,
  //               "0"
  //             )}`;
  //           } else {
  //             schoolCode = `${state}${city}01`;
  //           }

  //           // Ensure the school_code length does not exceed 20 characters (adjust based on your schema)
  //           if (schoolCode.length > 20) {
  //             schoolCode = schoolCode.substring(0, 20);
  //           }

  //           resolve(schoolCode);
  //         });
  //       });
  //     };

  //     // Function to get state, district, and city IDs
  //     const getLocationIds = (state, district, city) => {
  //       return new Promise((resolve, reject) => {
  //         const sqlQuery = `
  //         SELECT 
  //           s.id AS state_id, 
  //           d.id AS district_id, 
  //           c.id AS city_id
  //         FROM states s 
  //         JOIN districts d ON d.state_id = s.id 
  //         JOIN cities c ON c.district_id = d.id 
  //         WHERE s.name = ? AND d.name = ? AND c.name = ?
  //       `;

  //         db.query(sqlQuery, [state, district, city], (err, results) => {
  //           if (err) {
  //             return reject(err);
  //           } else if (results.length === 0) {
  //             return reject(
  //               new Error(`Location Not Found: ${state}, ${district}, ${city}`)
  //             );
  //           }
  //           resolve(results[0]);
  //         });
  //       });
  //     };

  //     // Process each school entry
  //     const processSchools = async () => {
  //       try {
  //         const values = [];

  //         for (const school of schools) {
  //           const { state, district, city } = school;

  //           if (!state || !district || !city) {
  //             throw new Error(
  //               "State, district, and city are required for each school."
  //             );
  //           }

  //           try {
  //             const locationIds = await getLocationIds(state, district, city);
  //             const schoolCode = await generateSchoolCode(state, city);

  //             values.push([
  //               school.board,
  //               school.school_name,
  //               school.school_email,
  //               school.school_contact_number,
  //               school.school_landline_number || null,
  //               locationIds.state_id,
  //               locationIds.district_id,
  //               locationIds.city_id,
  //               school.pincode,
  //               school.principal_name,
  //               school.principal_contact_number,
  //               school.principal_whatsapp,
  //               school.vice_principal_name || null,
  //               school.vice_principal_contact_number || null,
  //               school.vice_principal_whatsapp || null,
  //               school.student_strength,
  //               JSON.stringify(school.classes || []),
  //               school.status,
  //               schoolCode,
  //             ]);
  //           } catch (error) {
  //             console.warn(error.message);
  //             reject({ message: error.message });
  //             return;
  //           }
  //         }

  //         const query = `
  //         INSERT INTO school
  //         (board, school_name, school_email, school_contact_number, school_landline_number, state, district, city, pincode, principal_name, principal_contact_number, principal_whatsapp, vice_principal_name, vice_principal_contact_number, vice_principal_whatsapp, student_strength, classes, status, school_code)
  //         VALUES ?
  //       `;

  //         db.query(query, [values], (err, results) => {
  //           if (err) {
  //             return reject(err);
  //           }
  //           resolve(results);
  //         });
  //       } catch (error) {
  //         reject(error);
  //       }
  //     };

  //     processSchools();
  //   });
  // },
  bulkCreate: (schools) => {
    return new Promise((resolve, reject) => {
      // Function to generate unique school codes
      const generateSchoolCode = (stateId, cityId) => {
        return new Promise((resolve, reject) => {
          const sqlGetLatestCode = `
            SELECT school_code FROM school 
            WHERE school_code LIKE '${stateId}${cityId}%' 
            ORDER BY school_code DESC LIMIT 1
          `;
  
          db.query(sqlGetLatestCode, (err, results) => {
            if (err) {
              return reject(err);
            }
  
            let schoolCode;
            if (results.length > 0) {
              const latestCode = results[0].school_code;
              const numericPart = parseInt(latestCode.substring(4), 10);
              const newNumericPart = numericPart + 1;
              schoolCode = `${stateId}${cityId}${String(newNumericPart).padStart(
                2,
                "0"
              )}`;
            } else {
              schoolCode = `${stateId}${cityId}01`;
            }
  
            // Ensure the school_code length does not exceed 20 characters (adjust based on your schema)
            if (schoolCode.length > 20) {
              schoolCode = schoolCode.substring(0, 20);
            }
  
            resolve(schoolCode);
          });
        });
      };
  
      // Function to get state, district, and city IDs
      const getLocationIds = (state, district, city) => {
        return new Promise((resolve, reject) => {
          const sqlQuery = `
            SELECT 
              s.id AS state_id, 
              d.id AS district_id, 
              c.id AS city_id
            FROM states s 
            JOIN districts d ON d.state_id = s.id 
            JOIN cities c ON c.district_id = d.id 
            WHERE s.name = ? AND d.name = ? AND c.name = ?
          `;
  
          db.query(sqlQuery, [state, district, city], (err, results) => {
            if (err) {
              return reject(err);
            } else if (results.length === 0) {
              return reject(
                new Error(`Location Not Found: ${state}, ${district}, ${city}`)
              );
            }
            resolve(results[0]);
          });
        });
      };
  
      // Process each school entry
      const processSchools = async () => {
        try {
          const values = [];
  
          for (const school of schools) {
            const { state, district, city } = school;
  
            if (!state || !district || !city) {
              throw new Error(
                "State, district, and city are required for each school."
              );
            }
  
            try {
              const locationIds = await getLocationIds(state, district, city);
              const schoolCode = await generateSchoolCode(locationIds.state_id, locationIds.city_id);
  
              values.push([
                school.board,
                school.school_name,
                school.school_email,
                school.school_contact_number,
                school.school_landline_number || null,
                locationIds.state_id,
                locationIds.district_id,
                locationIds.city_id,
                school.pincode,
                school.principal_name,
                school.principal_contact_number,
                school.principal_whatsapp,
                school.vice_principal_name || null,
                school.vice_principal_contact_number || null,
                school.vice_principal_whatsapp || null,
                school.student_strength,
                JSON.stringify(school.classes || []),
                school.status,
                schoolCode,
              ]);
            } catch (error) {
              console.warn(error.message);
              reject({ message: error.message });
              return;
            }
          }
  
          const query = `
            INSERT INTO school
            (board, school_name, school_email, school_contact_number, school_landline_number, state, district, city, pincode, principal_name, principal_contact_number, principal_whatsapp, vice_principal_name, vice_principal_contact_number, vice_principal_whatsapp, student_strength, classes, status, school_code)
            VALUES ?
          `;
  
          db.query(query, [values], (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        } catch (error) {
          reject(error);
        }
      };
  
      processSchools();
    });
  },

  //  bulkCreate: (schools) => {
  //   return new Promise((resolve, reject) => {
  //     // Function to generate unique school codes
  //     const generateSchoolCode = (state, city) => {
  //       return new Promise((resolve, reject) => {
  //         // Truncate state and city to ensure the code length is within the limit
  //         const truncatedState = state.substring(0, 3); // Adjust length as needed
  //         const truncatedCity = city.split(' ').map(word => word[0]).join('').substring(0, 3); // Use initials of city name

  //         const sqlGetLatestCode = `
  //           SELECT school_code FROM school
  //           WHERE school_code LIKE '${truncatedState}${truncatedCity}%'
  //           ORDER BY school_code DESC LIMIT 1
  //         `;

  //         db.query(sqlGetLatestCode, (err, results) => {
  //           if (err) {
  //             return reject(err);
  //           }

  //           let schoolCode;
  //           if (results.length > 0) {
  //             const latestCode = results[0].school_code;
  //             const numericPart = parseInt(latestCode.substring(6), 10); // Adjust index based on truncation
  //             const newNumericPart = numericPart + 1;
  //             schoolCode = `${truncatedState}${truncatedCity}${String(newNumericPart).padStart(2, "0")}`;
  //           } else {
  //             schoolCode = `${truncatedState}${truncatedCity}01`;
  //           }

  //           // Ensure the school_code length does not exceed 20 characters (adjust based on your schema)
  //           if (schoolCode.length > 20) {
  //             schoolCode = schoolCode.substring(0, 20);
  //           }

  //           resolve(schoolCode);
  //         });
  //       });
  //     };

  //     // Function to get state, district, and city IDs
  //     const getLocationIds = (state, district, city) => {
  //       return new Promise((resolve, reject) => {
  //         const sqlQuery = `
  //           SELECT
  //             s.id AS state_id,
  //             d.id AS district_id,
  //             c.id AS city_id
  //           FROM states s
  //           JOIN districts d ON d.state_id = s.id
  //           JOIN cities c ON c.district_id = d.id
  //           WHERE s.name = ? AND d.name = ? AND c.name = ?
  //         `;

  //         db.query(sqlQuery, [state, district, city], (err, results) => {
  //           if (err) {
  //             return reject(err);
  //           } else if (results.length === 0) {
  //             return reject(new Error(`Location Not Found: ${state}, ${district}, ${city}`));
  //           }
  //           resolve(results[0]);
  //         });
  //       });
  //     };

  //     // Process each school entry
  //     const processSchools = async () => {
  //       try {
  //         const values = [];

  //         for (const school of schools) {
  //           const { state, district, city } = school;

  //           if (!state || !district || !city) {
  //             throw new Error("State, district, and city are required for each school.");
  //           }

  //           try {
  //             const locationIds = await getLocationIds(state, district, city);
  //             const schoolCode = await generateSchoolCode(state, city);

  //             values.push([
  //               school.board,
  //               school.school_name,
  //               school.school_email,
  //               school.school_contact_number,
  //               school.school_landline_number || null,
  //               locationIds.state_id,
  //               locationIds.district_id,
  //               locationIds.city_id,
  //               school.pincode,
  //               school.principal_name,
  //               school.principal_contact_number,
  //               school.principal_whatsapp,
  //               school.vice_principal_name || null,
  //               school.vice_principal_contact_number || null,
  //               school.vice_principal_whatsapp || null,
  //               school.student_strength,
  //               JSON.stringify(school.classes || []),
  //               school.status,
  //               schoolCode,
  //             ]);
  //           } catch (error) {
  //             console.warn(error.message);
  //             reject({ message: error.message });
  //             return;
  //           }
  //         }

  //         const query = `
  //           INSERT INTO school
  //           (board, school_name, school_email, school_contact_number, school_landline_number, state, district, city, pincode, principal_name, principal_contact_number, principal_whatsapp, vice_principal_name, vice_principal_contact_number, vice_principal_whatsapp, student_strength, classes, status, school_code)
  //           VALUES ?
  //         `;

  //         db.query(query, [values], (err, results) => {
  //           if (err) {
  //             return reject(err);
  //           }
  //           resolve(results);
  //         });
  //       } catch (error) {
  //         reject(error);
  //       }
  //     };

  //     processSchools();
  //   });
  // },





  // Update a school's details
  update: (id, data, callback) => {
    // Ensure 'classes' is a valid JSON string
    const classes = data.classes ? JSON.stringify(data.classes) : "[]"; // Default to an empty array if null/undefined

    const sql = `
    UPDATE school 
    SET board = ?, school_name = ?, school_email = ?, school_contact_number = ?, 
        school_landline_number = ?, state = ?, district = ?, city = ?, pincode = ?, 
        principal_name = ?, principal_contact_number = ?, principal_whatsapp = ?, 
        vice_principal_name = ?, vice_principal_contact_number = ?, 
        vice_principal_whatsapp = ?, student_strength = ?, classes = ?, status = ? 
    WHERE id = ?`;

    const values = [
      data.board,
      data.school_name,
      data.school_email,
      data.school_contact_number,
      data.school_landline_number || null,
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
      data.status || null,
      id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating school:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  // Delete a school by ID
  delete: (id, callback) => {
    const sql = "DELETE FROM school WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

export default School;
