import { db } from "../../config/db.js";

const School = {
  // Get all schools
  getAllSchool: (callback) => {
    const sql = `
      SELECT 
    s.*, 
    c1.name AS country_name,
    s1.name AS state_name, 
    d.name AS district_name,   
    c2.name AS city_name
FROM school s
LEFT JOIN countries c1 ON s.country = c1.id
LEFT JOIN states s1 ON s.state = s1.id
LEFT JOIN districts d ON s.district = d.id
LEFT JOIN cities c2 ON s.city = c2.id
ORDER BY s.id DESC;
    `;
    db.query(sql, callback);
  },

  //get all school for paginations
  getAll: (page = 1, limit = 10, search = "", callback) => {
    const offset = (page - 1) * limit;
    let whereClause = "";
    let queryParams = [];

    if (search && search.trim() !== "") {
      whereClause = `WHERE 
      s.school_name LIKE ? OR
      s.school_email LIKE ? OR
      c1.name LIKE ? OR
      s1.name LIKE ? OR
      d.name LIKE ? OR
      c2.name LIKE ?`;
      for (let i = 0; i < 6; i++) queryParams.push(`%${search}%`);
    }

    const query = `
    SELECT 
      s.*, 
      c1.name AS country_name,
      s1.name AS state_name, 
      d.name AS district_name,   
      c2.name AS city_name
    FROM school s
    LEFT JOIN countries c1 ON s.country = c1.id
    LEFT JOIN states s1 ON s.state = s1.id
    LEFT JOIN districts d ON s.district = d.id
    LEFT JOIN cities c2 ON s.city = c2.id
    ${whereClause}
    ORDER BY s.id DESC
    LIMIT ? OFFSET ?;
  `;

    const countQuery = `
    SELECT COUNT(*) AS total FROM school s
    LEFT JOIN countries c1 ON s.country = c1.id
    LEFT JOIN states s1 ON s.state = s1.id
    LEFT JOIN districts d ON s.district = d.id
    LEFT JOIN cities c2 ON s.city = c2.id
    ${whereClause};
  `;

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      db.query(
        query,
        [...queryParams, parseInt(limit), parseInt(offset)],
        (err, result) => {
          if (err) return callback(err);

          callback(null, {
            schools: result,
            currentPage: page,
            nextPage,
            prevPage,
            totalPages,
            totalRecords,
          });
        }
      );
    });
  },

  // Get a school by ID
  getById: (id, callback) => {
    const sql = "SELECT * FROM school WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // create: (data) => {
  //   return new Promise((resolve, reject) => {
  //     const { state, city } = data; //Get state and city codes from input

  //     if (!state || !city) {
  //       return reject(new Error("State code and city code are required"));
  //     }

  //     // Query to get the latest school code for the given state and city
  //     const sqlGetLatestCode = `
  //       SELECT school_code FROM school
  //       WHERE school_code LIKE ?
  //       ORDER BY school_code DESC LIMIT 1
  //     `;

  //     const stateCityPrefix = `${state}${city}`;

  //     db.query(sqlGetLatestCode, [`${stateCityPrefix}%`], (err, results) => {
  //       if (err) {
  //         return reject(err);
  //       }

  //       let schoolCode;
  //       if (results.length > 0) {
  //         // Extract the numeric part of the latest school code
  //         const latestCode = results[0].school_code;
  //         const numericPart = parseInt(latestCode.substring(4), 10); // Get the incremental number
  //         const newNumericPart = numericPart + 1;
  //         schoolCode = `${stateCityPrefix}${String(newNumericPart).padStart(
  //           2,
  //           "0"
  //         )}`;
  //       } else {
  //         // If no school exists for the state & city, start from '01'
  //         schoolCode = `${stateCityPrefix}01`;
  //       }

  //       // SQL for inserting the new school data
  //       const sql = `
  //       INSERT INTO school (
  //         board, school_name, school_email, school_contact_number, school_landline_number,
  //         school_address, state, district, city, pincode, country,
  //         principal_name, principal_contact_number, principal_whatsapp,
  //         vice_principal_name, vice_principal_contact_number, vice_principal_whatsapp,
  //         manager_name, manager_contact_number, manager_whatsapp_number,
  //         first_incharge_name, first_incharge_number, first_incharge_whatsapp,
  //         second_incharge_name, second_incharge_number, second_incharge_whatsapp,
  //         junior_student_strength, senior_student_strength, classes,
  //         status, status_approved, school_code, created_by, updated_by
  //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //     `;

  //       const values = [
  //         data.board,
  //         data.school_name,
  //         data.school_email,
  //         data.school_contact_number,
  //         data.school_landline_number || null,
  //         data.school_address,
  //         data.state,
  //         data.district,
  //         data.city,
  //         data.pincode,
  //         data.country, // Added country field
  //         data.principal_name,
  //         data.principal_contact_number,
  //         data.principal_whatsapp,
  //         data.vice_principal_name,
  //         data.vice_principal_contact_number,
  //         data.vice_principal_whatsapp,
  //         data.manager_name,
  //         data.manager_contact_number,
  //         data.manager_whatsapp_number,
  //         data.first_incharge_name,
  //         data.first_incharge_number,
  //         data.first_incharge_whatsapp,
  //         data.second_incharge_name,
  //         data.second_incharge_number,
  //         data.second_incharge_whatsapp,
  //         // data.junior_student_strength,
  //         // data.senior_student_strength,
  //         data.junior_student_strength === ""
  //           ? 0
  //           : Number(data.junior_student_strength),
  //         data.senior_student_strength === ""
  //           ? 0
  //           : Number(data.senior_student_strength),
  //         JSON.stringify(data.classes || []),
  //         data.status || null,
  //         data.status_approved,
  //         schoolCode,
  //         data.created_by,
  //         data.updated_by,
  //       ];

  //       // Insert the new school data
  //       db.query(sql, values, (err, results) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve({ ...results, school_code: schoolCode });
  //         }
  //       });
  //     });
  //   });
  // },

  create: (data) => {
    return new Promise((resolve, reject) => {
      const { state, city } = data; // Get state and city codes from input

      if (!state || !city) {
        return reject(new Error("State code and city code are required"));
      }

      // Query to get the latest school code for the given state and city
      const sqlGetLatestCode = `
        SELECT school_code FROM school 
        WHERE school_code LIKE ? 
        ORDER BY school_code DESC LIMIT 1
      `;

      const stateCityPrefix = `${state}${city}`;

      db.query(sqlGetLatestCode, [`${stateCityPrefix}%`], (err, results) => {
        if (err) {
          return reject(err);
        }

        let schoolCode;
        if (results.length > 0) {
          // Extract the numeric part of the latest school code
          const latestCode = results[0].school_code;
          const numericPart = parseInt(latestCode.substring(4), 10); // Get the incremental number
          const newNumericPart = numericPart + 1;
          schoolCode = `${stateCityPrefix}${String(newNumericPart).padStart(
            2,
            "0"
          )}`;
        } else {
          // If no school exists for the state & city, start from '01'
          schoolCode = `${stateCityPrefix}01`;
        }

        // SQL for inserting the new school data
        const sql = `
          INSERT INTO school (
            board, school_name, school_email, school_contact_number, school_landline_number,
            school_address, state, district, city, pincode, country,
            principal_name, principal_contact_number, principal_whatsapp, 
            vice_principal_name, vice_principal_contact_number, vice_principal_whatsapp, 
            manager_name, manager_contact_number, manager_whatsapp_number, 
            first_incharge_name, first_incharge_number, first_incharge_whatsapp, 
            second_incharge_name, second_incharge_number, second_incharge_whatsapp, 
            junior_student_strength, senior_student_strength, classes, 
            status, status_approved, approved_by, school_code, created_by, updated_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          data.board,
          data.school_name,
          data.school_email,
          data.school_contact_number,
          data.school_landline_number || null,
          data.school_address,
          data.state,
          data.district,
          data.city,
          data.pincode,
          data.country,
          data.principal_name,
          data.principal_contact_number,
          data.principal_whatsapp,
          data.vice_principal_name,
          data.vice_principal_contact_number,
          data.vice_principal_whatsapp,
          data.manager_name,
          data.manager_contact_number,
          data.manager_whatsapp_number,
          data.first_incharge_name,
          data.first_incharge_number,
          data.first_incharge_whatsapp,
          data.second_incharge_name,
          data.second_incharge_number,
          data.second_incharge_whatsapp,
          data.junior_student_strength === ""
            ? 0
            : Number(data.junior_student_strength),
          data.senior_student_strength === ""
            ? 0
            : Number(data.senior_student_strength),
          JSON.stringify(data.classes || []),
          data.status || null,
          data.status_approved,
          data.approved_by,
          schoolCode,
          data.created_by,
          data.updated_by,
        ];

        // Insert the new school data
        db.query(sql, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve({ ...results, school_code: schoolCode });
          }
        });
      });
    });
  },

  // bulkCreate: (schools) => {
  //   return new Promise((resolve, reject) => {
  //     const generateSchoolCode = (stateId, cityId) => {
  //       return new Promise((resolve, reject) => {
  //         const prefix = `${stateId}${cityId}`;
  //         const sql = `
  //           SELECT school_code FROM school
  //           WHERE school_code LIKE ?
  //           ORDER BY school_code DESC LIMIT 1
  //         `;
  //         db.query(sql, [`${prefix}%`], (err, results) => {
  //           if (err) return reject(err);
  //           let schoolCode;
  //           if (results.length > 0) {
  //             const latest = results[0].school_code;
  //             const num = parseInt(latest.substring(prefix.length), 10) + 1;
  //             schoolCode = `${prefix}${String(num).padStart(2, "0")}`;
  //           } else {
  //             schoolCode = `${prefix}01`;
  //           }
  //           if (schoolCode.length > 20) {
  //             schoolCode = schoolCode.substring(0, 20);
  //           }
  //           resolve(schoolCode);
  //         });
  //       });
  //     };

  //     const validateLocation = (country, state, district, city) => {
  //       return new Promise((resolve, reject) => {
  //         const countrySql = `SELECT id FROM countries WHERE name = ?`;
  //         db.query(countrySql, [country], (err, countryResults) => {
  //           if (err) return reject(err);
  //           if (countryResults.length === 0)
  //             return reject(new Error(`Invalid country: ${country}`));
  //           const countryId = countryResults[0].id;

  //           const stateSql = `SELECT id FROM states WHERE name = ? AND country_id = ?`;
  //           db.query(stateSql, [state, countryId], (err, stateResults) => {
  //             if (err) return reject(err);
  //             if (stateResults.length === 0)
  //               return reject(new Error(`Invalid state: ${state}`));
  //             const stateId = stateResults[0].id;

  //             const districtSql = `SELECT id FROM districts WHERE name = ? AND state_id = ?`;
  //             db.query(
  //               districtSql,
  //               [district, stateId],
  //               (err, districtResults) => {
  //                 if (err) return reject(err);
  //                 if (districtResults.length === 0)
  //                   return reject(new Error(`Invalid district: ${district}`));
  //                 const districtId = districtResults[0].id;

  //                 const citySql = `SELECT id FROM cities WHERE name = ? AND district_id = ?`;
  //                 db.query(citySql, [city, districtId], (err, cityResults) => {
  //                   if (err) return reject(err);
  //                   if (cityResults.length === 0)
  //                     return reject(new Error(`Invalid city: ${city}`));
  //                   const cityId = cityResults[0].id;

  //                   resolve({
  //                     country_id: countryId,
  //                     state_id: stateId,
  //                     district_id: districtId,
  //                     city_id: cityId,
  //                   });
  //                 });
  //               }
  //             );
  //           });
  //         });
  //       });
  //     };

  //     const processSchools = async () => {
  //       try {
  //         const values = [];
  //         const insertedSchools = [];
  //         const errors = [];

  //         for (const school of schools) {
  //           const {
  //             country,
  //             state,
  //             district,
  //             city,
  //             board,
  //             school_name,
  //             school_address,
  //             pincode,
  //             created_by,
  //             updated_by,
  //             ...optionalFields
  //           } = school;

  //           const requiredFields = {
  //             country,
  //             state,
  //             district,
  //             city,
  //             board,
  //             school_name,
  //             school_address,
  //             pincode,
  //             created_by,
  //             updated_by,
  //           };

  //           const missingFields = Object.keys(requiredFields).filter(
  //             (key) => !requiredFields[key]
  //           );

  //           if (missingFields.length > 0) {
  //             errors.push({
  //               school: school_name || "Unnamed",
  //               error: `Missing required fields: ${missingFields.join(", ")}`,
  //             });
  //             continue;
  //           }

  //           try {
  //             const location = await validateLocation(
  //               country,
  //               state,
  //               district,
  //               city
  //             );
  //             const schoolCode = await generateSchoolCode(
  //               location.state_id,
  //               location.city_id
  //             );

  //             const schoolData = [
  //               board,
  //               school_name,
  //               school_address,
  //               pincode,
  //               location.country_id,
  //               location.state_id,
  //               location.district_id,
  //               location.city_id,
  //               schoolCode,
  //               optionalFields.school_email || null,
  //               optionalFields.principal_contact_number || null,
  //               created_by,
  //               updated_by,
  //               optionalFields.school_contact_number || null,
  //               optionalFields.school_landline_number || null,
  //               optionalFields.principal_name || null,
  //               optionalFields.principal_whatsapp || null,
  //               optionalFields.vice_principal_name || null,
  //               optionalFields.vice_principal_contact_number || null,
  //               optionalFields.vice_principal_whatsapp || null,
  //               optionalFields.manager_name || null,
  //               optionalFields.manager_contact_number || null,
  //               optionalFields.manager_whatsapp_number || null,
  //               optionalFields.first_incharge_name || null,
  //               optionalFields.first_incharge_number || null,
  //               optionalFields.first_incharge_whatsapp || null,
  //               optionalFields.second_incharge_name || null,
  //               optionalFields.second_incharge_number || null,
  //               optionalFields.second_incharge_whatsapp || null,
  //               optionalFields.junior_student_strength || null,
  //               optionalFields.senior_student_strength || null,
  //               optionalFields.classes
  //                 ? JSON.stringify(optionalFields.classes)
  //                 : null,
  //               optionalFields.status || null,
  //             ];

  //             values.push(schoolData);

  //             insertedSchools.push({
  //               ...school,
  //               school_code: schoolCode,
  //               country_id: location.country_id,
  //               state_id: location.state_id,
  //               district_id: location.district_id,
  //               city_id: location.city_id,
  //             });
  //           } catch (err) {
  //             errors.push({
  //               school: school_name,
  //               error: err.message,
  //             });
  //           }
  //         }

  //         if (values.length === 0) {
  //           return reject({ message: "No valid schools to insert", errors });
  //         }

  //         const sql = `
  //           INSERT INTO school (
  //             board, school_name, school_address, pincode,
  //             country, state, district, city, school_code,
  //             school_email, principal_contact_number,
  //             created_by, updated_by,
  //             school_contact_number, school_landline_number,
  //             principal_name, principal_whatsapp,
  //             vice_principal_name, vice_principal_contact_number, vice_principal_whatsapp,
  //             manager_name, manager_contact_number, manager_whatsapp_number,
  //             first_incharge_name, first_incharge_number, first_incharge_whatsapp,
  //             second_incharge_name, second_incharge_number, second_incharge_whatsapp,
  //             junior_student_strength, senior_student_strength, classes, status
  //           ) VALUES ?
  //         `;

  //         db.query(sql, [values], (err, result) => {
  //           if (err) return reject(err);
  //           resolve({
  //             affectedRows: result.affectedRows,
  //             schools: insertedSchools,
  //             errors: errors.length > 0 ? errors : undefined,
  //           });
  //         });
  //       } catch (err) {
  //         reject(err);
  //       }
  //     };

  //     processSchools();
  //   });
  // },

  bulkCreate: (schools) => {
    return new Promise((resolve, reject) => {
      const generateSchoolCode = (stateId, cityId) => {
        return new Promise((resolve, reject) => {
          const prefix = `${stateId}${cityId}`;
          const sql = `
            SELECT school_code FROM school 
            WHERE school_code LIKE ? 
            ORDER BY school_code DESC LIMIT 1
          `;
          db.query(sql, [`${prefix}%`], (err, results) => {
            if (err) return reject(err);
            let schoolCode;
            if (results.length > 0) {
              const latest = results[0].school_code;
              const num = parseInt(latest.substring(prefix.length), 10) + 1;
              schoolCode = `${prefix}${String(num).padStart(2, "0")}`;
            } else {
              schoolCode = `${prefix}01`;
            }
            if (schoolCode.length > 20) {
              schoolCode = schoolCode.substring(0, 20);
            }
            resolve(schoolCode);
          });
        });
      };

      const checkDuplicateEmail = (email) => {
        return new Promise((resolve, reject) => {
          if (!email) return resolve(true);
          const sql = `SELECT id FROM school WHERE school_email = ?`;
          db.query(sql, [email], (err, results) => {
            if (err) return reject(err);
            if (results.length > 0) {
              return reject(new Error(`Duplicate email: ${email}`));
            }
            resolve(true);
          });
        });
      };

      const validateLocation = (country, state, district, city) => {
        return new Promise((resolve, reject) => {
          const countrySql = `SELECT id FROM countries WHERE name = ?`;
          db.query(countrySql, [country], (err, countryResults) => {
            if (err)
              return reject(
                new Error("Database error while validating country")
              );
            if (countryResults.length === 0)
              return reject(new Error(`Invalid country: ${country}`));
            const countryId = countryResults[0].id;

            const stateSql = `SELECT id FROM states WHERE name = ? AND country_id = ?`;
            db.query(stateSql, [state, countryId], (err, stateResults) => {
              if (err)
                return reject(
                  new Error("Database error while validating state")
                );
              if (stateResults.length === 0)
                return reject(
                  new Error(`Invalid state: ${state} for country ${country}`)
                );
              const stateId = stateResults[0].id;

              const districtSql = `SELECT id FROM districts WHERE name = ? AND state_id = ?`;
              db.query(
                districtSql,
                [district, stateId],
                (err, districtResults) => {
                  if (err)
                    return reject(
                      new Error("Database error while validating district")
                    );
                  if (districtResults.length === 0)
                    return reject(
                      new Error(
                        `Invalid district: ${district} for state ${state}`
                      )
                    );
                  const districtId = districtResults[0].id;

                  const citySql = `SELECT id FROM cities WHERE name = ? AND district_id = ?`;
                  db.query(citySql, [city, districtId], (err, cityResults) => {
                    if (err)
                      return reject(
                        new Error("Database error while validating city")
                      );
                    if (cityResults.length === 0)
                      return reject(
                        new Error(
                          `Invalid city: ${city} for district ${district}`
                        )
                      );
                    const cityId = cityResults[0].id;

                    resolve({
                      country_id: countryId,
                      state_id: stateId,
                      district_id: districtId,
                      city_id: cityId,
                    });
                  });
                }
              );
            });
          });
        });
      };

      const processSchools = async () => {
        try {
          const values = [];
          const insertedSchools = [];
          const errors = [];

          for (const school of schools) {
            const {
              country,
              state,
              district,
              city,
              board,
              school_name,
              school_address,
              pincode,
              created_by,
              updated_by,
              school_email,
              ...optionalFields
            } = school;

            const requiredFields = {
              country,
              state,
              district,
              city,
              board,
              school_name,
              school_address,
              pincode,
              created_by,
              updated_by,
            };

            const missingFields = Object.keys(requiredFields).filter(
              (key) => !requiredFields[key]
            );

            if (missingFields.length > 0) {
              errors.push({
                school: school_name || "Unnamed",
                error: `Missing required fields: ${missingFields.join(", ")}`,
              });
              continue;
            }

            try {
              await checkDuplicateEmail(school_email);
              const location = await validateLocation(
                country,
                state,
                district,
                city
              );
              const schoolCode = await generateSchoolCode(
                location.state_id,
                location.city_id
              );

              const schoolData = [
                board,
                school_name,
                school_address,
                pincode,
                location.country_id,
                location.state_id,
                location.district_id,
                location.city_id,
                schoolCode,
                school_email || null,
                optionalFields.principal_contact_number || null,
                created_by,
                updated_by,
                optionalFields.school_contact_number || null,
                optionalFields.school_landline_number || null,
                optionalFields.principal_name || null,
                optionalFields.principal_whatsapp || null,
                optionalFields.vice_principal_name || null,
                optionalFields.vice_principal_contact_number || null,
                optionalFields.vice_principal_whatsapp || null,
                optionalFields.manager_name || null,
                optionalFields.manager_contact_number || null,
                optionalFields.manager_whatsapp_number || null,
                optionalFields.first_incharge_name || null,
                optionalFields.first_incharge_number || null,
                optionalFields.first_incharge_whatsapp || null,
                optionalFields.second_incharge_name || null,
                optionalFields.second_incharge_number || null,
                optionalFields.second_incharge_whatsapp || null,
                optionalFields.junior_student_strength || null,
                optionalFields.senior_student_strength || null,
                optionalFields.classes
                  ? JSON.stringify(optionalFields.classes)
                  : null,
                optionalFields.status || null,
              ];

              values.push(schoolData);

              insertedSchools.push({
                ...school,
                school_code: schoolCode,
                country_id: location.country_id,
                state_id: location.state_id,
                district_id: location.district_id,
                city_id: location.city_id,
              });
            } catch (err) {
              errors.push({
                school: school_name || "Unnamed",
                error: err.message,
              });
            }
          }

          if (values.length === 0) {
            return reject({ message: "No valid schools to insert", errors });
          }

          const sql = `
            INSERT INTO school (
              board, school_name, school_address, pincode,
              country, state, district, city, school_code,
              school_email, principal_contact_number,
              created_by, updated_by,
              school_contact_number, school_landline_number,
              principal_name, principal_whatsapp,
              vice_principal_name, vice_principal_contact_number, vice_principal_whatsapp,
              manager_name, manager_contact_number, manager_whatsapp_number,
              first_incharge_name, first_incharge_number, first_incharge_whatsapp,
              second_incharge_name, second_incharge_number, second_incharge_whatsapp,
              junior_student_strength, senior_student_strength, classes, status
            ) VALUES ?
          `;

          db.query(sql, [values], (err, result) => {
            if (err)
              return reject(
                new Error(`Database error during insertion: ${err.message}`)
              );
            resolve({
              affectedRows: result.affectedRows,
              schools: insertedSchools,
              errors: errors.length > 0 ? errors : undefined,
            });
          });
        } catch (err) {
          reject(new Error(`Processing error: ${err.message}`));
        }
      };

      processSchools();
    });
  },

  update: (id, data, callback) => {
    // Ensure 'classes' is a valid JSON string
    const classes = data.classes ? JSON.stringify(data.classes) : "[]"; // Default to an empty array if null/undefined

    const sql = `
    UPDATE school 
    SET board = ?, school_name = ?, school_email = ?, school_contact_number = ?, 
        school_landline_number = ?, country = ?, state = ?, district = ?, city = ?, pincode = ?, 
        principal_name = ?, principal_contact_number = ?, principal_whatsapp = ?, 
        vice_principal_name = ?, vice_principal_contact_number = ?, 
        vice_principal_whatsapp = ?,  classes = ?, status = ?,
        manager_name = ?, manager_contact_number = ?, manager_whatsapp_number = ?,
        first_incharge_name = ?, first_incharge_number = ?, first_incharge_whatsapp = ?,
        second_incharge_name = ?, second_incharge_number = ?, second_incharge_whatsapp = ?,
        junior_student_strength = ?, senior_student_strength = ?, school_address = ?
    WHERE id = ?`;

    const values = [
      data.board,
      data.school_name,
      data.school_email,
      data.school_contact_number,
      data.school_landline_number || null,
      data.country || null, // Added country field
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
      classes, // Update classes as JSON string
      data.status || null,
      data.manager_name || null,
      data.manager_contact_number || null,
      data.manager_whatsapp_number || null,
      data.first_incharge_name || null,
      data.first_incharge_number || null,
      data.first_incharge_whatsapp || null,
      data.second_incharge_name || null,
      data.second_incharge_number || null,
      data.second_incharge_whatsapp || null,
      data.junior_student_strength || null,
      data.senior_student_strength || null,
      data.school_address || null,
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

  // Get schools filtered by location (country, state, district, city)
  getSchoolCountByLocation: (filters) => {
    return new Promise((resolve, reject) => {
      const { country, state, district, city } = filters;

      const sql = `
          SELECT
            COUNT(s.id) AS school_count,
            c.name AS country_name,
            st.name AS state_name,
            d.name AS district_name,
            ci.name AS city_name,
            GROUP_CONCAT(s.school_name ORDER BY s.school_name ASC) AS school_names
          FROM school s
          LEFT JOIN countries c ON s.country = c.id
          LEFT JOIN states st ON s.state = st.id
          LEFT JOIN districts d ON s.district = d.id
          LEFT JOIN cities ci ON s.city = ci.id
          WHERE
            (? IS NULL OR s.country = ?) AND
            (? IS NULL OR s.state = ?) AND
            (? IS NULL OR s.district = ?) AND
            (? IS NULL OR s.city = ?)
          GROUP BY
            c.name, st.name, d.name, ci.name
          ORDER BY
            c.name, st.name, d.name, ci.name
        `;

      const values = [
        country,
        country,
        state,
        state,
        district,
        district,
        city,
        city,
      ];

      db.query(sql, values, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },
  
  // school approved code
  // updateStatusApprovedById: (id, status_approved) => {
  //   return new Promise((resolve, reject) => {
  //     const sql = `
  //       UPDATE school
  //       SET status_approved = ?
  //       WHERE id = ?
  //     `;
  //     db.query(sql, [status_approved, id], (err, results) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(results);
  //       }
  //     });
  //   });
  // },
  updateStatusApprovedById: (id, status_approved, approved_by) => {
    return new Promise((resolve, reject) => {
      const sql = `
      UPDATE school 
      SET status_approved = ?, approved_by = ? 
      WHERE id = ?
    `;
      db.query(sql, [status_approved, approved_by, id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  //extra get schools id filterd by location (country, state, district, city)
  getSchoolIdByLocation: (filters) => {
    return new Promise((resolve, reject) => {
      const { country, state, district, city } = filters;

      const sql = `
          SELECT
            COUNT(s.id) AS school_count,
            c.name AS country_name,
            st.name AS state_name,
            d.name AS district_name,
            ci.name AS city_name,
            GROUP_CONCAT(
              CONCAT(s.id, ':', s.school_name) 
              ORDER BY s.school_name ASC
              SEPARATOR ','
            ) AS school_info
          FROM school s
          LEFT JOIN countries c ON s.country = c.id
          LEFT JOIN states st ON s.state = st.id
          LEFT JOIN districts d ON s.district = d.id
          LEFT JOIN cities ci ON s.city = ci.id
          WHERE
            (? IS NULL OR s.country = ?) AND
            (? IS NULL OR s.state = ?) AND
            (? IS NULL OR s.district = ?) AND
            (? IS NULL OR s.city = ?)
          GROUP BY
            c.name, st.name, d.name, ci.name
          ORDER BY
            c.name, st.name, d.name, ci.name
        `;

      const values = [
        country,
        country,
        state,
        state,
        district,
        district,
        city,
        city,
      ];

      db.query(sql, values, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

};

export default School;
