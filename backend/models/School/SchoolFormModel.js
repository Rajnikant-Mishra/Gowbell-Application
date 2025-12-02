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
  // getAll: (page = 1, limit = 10, search = "", callback) => {
  //   const offset = (page - 1) * limit;
  //   let whereClause = "";
  //   let queryParams = [];

  //   if (search && search.trim() !== "") {
  //     whereClause = `WHERE
  //     s.school_name LIKE ? OR
  //     s.school_email LIKE ? OR
  //     c1.name LIKE ? OR
  //     s1.name LIKE ? OR
  //     d.name LIKE ? OR
  //     c2.name LIKE ?`;
  //     for (let i = 0; i < 6; i++) queryParams.push(`%${search}%`);
  //   }

  //   const query = `
  //   SELECT
  //     s.*,
  //     c1.name AS country_name,
  //     s1.name AS state_name,
  //     d.name AS district_name,
  //     c2.name AS city_name
  //   FROM school s
  //   LEFT JOIN countries c1 ON s.country = c1.id
  //   LEFT JOIN states s1 ON s.state = s1.id
  //   LEFT JOIN districts d ON s.district = d.id
  //   LEFT JOIN cities c2 ON s.city = c2.id
  //   ${whereClause}
  //   ORDER BY s.id DESC
  //   LIMIT ? OFFSET ?;
  // `;

  //   const countQuery = `
  //   SELECT COUNT(*) AS total FROM school s
  //   LEFT JOIN countries c1 ON s.country = c1.id
  //   LEFT JOIN states s1 ON s.state = s1.id
  //   LEFT JOIN districts d ON s.district = d.id
  //   LEFT JOIN cities c2 ON s.city = c2.id
  //   ${whereClause};
  // `;

  //   db.query(countQuery, queryParams, (err, countResult) => {
  //     if (err) return callback(err);

  //     const totalRecords = countResult[0].total;
  //     const totalPages = Math.ceil(totalRecords / limit);
  //     const nextPage = page < totalPages ? page + 1 : null;
  //     const prevPage = page > 1 ? page - 1 : null;

  //     db.query(
  //       query,
  //       [...queryParams, parseInt(limit), parseInt(offset)],
  //       (err, result) => {
  //         if (err) return callback(err);

  //         callback(null, {
  //           schools: result,
  //           currentPage: page,
  //           nextPage,
  //           prevPage,
  //           totalPages,
  //           totalRecords,
  //         });
  //       }
  //     );
  //   });
  // },

  getAll: (page = 1, limit = 10, search = "", callback) => {
    const offset = (page - 1) * limit;
    let whereClause = "";
    let queryParams = [];

    // 🔍 Search conditions
    if (search && search.trim() !== "") {
      whereClause = `WHERE
      s.school_name LIKE ? OR
      s.school_email LIKE ? OR
      s.school_code LIKE ? OR
      a.name LIKE ? OR
      c1.name LIKE ? OR
      s1.name LIKE ? OR
      d.name LIKE ? OR
      c2.name LIKE ?`;
      // 8 parameters for placeholders
      for (let i = 0; i < 8; i++) queryParams.push(`%${search}%`);
    }

    // 🧩 Main query with affiliated join
    const query = `
    SELECT
      s.*,
      a.name AS board_name,
      c1.name AS country_name,
      s1.name AS state_name,
      d.name AS district_name,
      c2.name AS city_name
    FROM school s
    LEFT JOIN affiliated a ON s.board = a.id
    LEFT JOIN countries c1 ON s.country = c1.id
    LEFT JOIN states s1 ON s.state = s1.id
    LEFT JOIN districts d ON s.district = d.id
    LEFT JOIN cities c2 ON s.city = c2.id
    ${whereClause}
    ORDER BY s.id DESC
    LIMIT ? OFFSET ?;
  `;

    // 🧮 Count query (for pagination)
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM school s
    LEFT JOIN affiliated a ON s.board = a.id
    LEFT JOIN countries c1 ON s.country = c1.id
    LEFT JOIN states s1 ON s.state = s1.id
    LEFT JOIN districts d ON s.district = d.id
    LEFT JOIN cities c2 ON s.city = c2.id
    ${whereClause};
  `;

    // 🧾 Execute count first
    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return callback(err);

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      // 🧩 Fetch paginated data
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

  create: (data) => {
    return new Promise((resolve, reject) => {
      const { state, city, school_name } = data;

      if (!state || !city) {
        return reject(new Error("State code and city code are required"));
      }

      if (!school_name) {
        return reject(new Error("School name is required"));
      }

      // ✅ Step 1: Query to get the latest school code
      const sqlGetLatestCode = `
      SELECT school_code FROM school 
      WHERE school_code LIKE ? 
      ORDER BY school_code DESC LIMIT 1
    `;
      const stateCityPrefix = `${state}${city}`;

      // ✅ Step 2: Resolve session_id dynamically
      const resolveSessionId = (next) => {
        if (data.session_id) {
          const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
          db.query(verifyQuery, [data.session_id], (err, result) => {
            if (err) return reject(err);
            if (result.length === 0)
              return reject(new Error("Invalid session ID selected"));
            return next(data.session_id);
          });
        } else {
          const sqlGetSessionId = `
          SELECT id FROM gowvell_session 
          WHERE status = 'active' 
          ORDER BY id DESC LIMIT 1
        `;
          db.query(sqlGetSessionId, (err, sessionResults) => {
            if (err) return reject(err);
            if (sessionResults.length === 0)
              return reject(new Error("No active session found"));
            return next(sessionResults[0].id);
          });
        }
      };

      // ✅ Step 3: Get latest school code and insert
      resolveSessionId((sessionId) => {
        db.query(sqlGetLatestCode, [`${stateCityPrefix}%`], (err, results) => {
          if (err) return reject(err);

          let schoolCode;
          if (results.length > 0) {
            const latestCode = results[0].school_code;
            const numericPart = parseInt(latestCode.substring(4), 10);
            const newNumericPart = numericPart + 1;
            schoolCode = `${stateCityPrefix}${String(newNumericPart).padStart(
              2,
              "0"
            )}`;
          } else {
            schoolCode = `${stateCityPrefix}01`;
          }

          // ✅ Step 4: Insert new school (no area_name, no duplicate check)
          const sql = `
          INSERT INTO school (
            session_id, board, school_name, school_email, school_contact_number, school_landline_number,
            school_address, state, district, city, pincode, country,
            principal_name, principal_contact_number, principal_whatsapp, 
            vice_principal_name, vice_principal_contact_number, vice_principal_whatsapp, 
            manager_name, manager_contact_number, manager_whatsapp_number, 
            first_incharge_name, first_incharge_number, first_incharge_whatsapp, 
            second_incharge_name, second_incharge_number, second_incharge_whatsapp, 
            junior_student_strength, senior_student_strength, classes, 
            status, status_approved, approved_by, school_code, created_by, updated_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

          const values = [
            sessionId,
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

          db.query(sql, values, (err, insertResults) => {
            if (err) return reject(err);
            resolve({
              ...insertResults,
              school_code: schoolCode,
              session_id: sessionId,
            });
          });
        });
      });
    });
  },

  bulkCreate: (schools) => {
    return new Promise((resolve, reject) => {
      const codeTrackers = new Map();

      const generateSchoolCode = (stateId, cityId) => {
        return new Promise((resolve, reject) => {
          const prefix = `${stateId}${cityId}`;

          if (!codeTrackers.has(prefix)) {
            codeTrackers.set(prefix, { nextNum: 1, existingCodes: new Set() });
          }

          const tracker = codeTrackers.get(prefix);
          const sql = `
          SELECT school_code 
          FROM school 
          WHERE school_code LIKE ? 
          ORDER BY school_code DESC LIMIT 1
        `;

          db.query(sql, [`${prefix}%`], (err, results) => {
            if (err) return reject(err);

            let num = tracker.nextNum;
            if (results.length > 0) {
              const latest = results[0].school_code;
              const numPart = latest.substring(prefix.length);
              const dbNum = numPart ? parseInt(numPart, 10) + 1 : 1;
              num = Math.max(num, dbNum);
            }

            let schoolCode;
            do {
              schoolCode = `${prefix}${String(num).padStart(2, "0")}`;
              num++;
            } while (tracker.existingCodes.has(schoolCode));

            tracker.existingCodes.add(schoolCode);
            tracker.nextNum = num;

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

      const processSchools = async (sessionId) => {
        try {
          const values = [];
          const insertedSchools = [];
          const errors = [];

          const normalizeStatus = (raw) => {
            if (!raw) return "active";
            const s = String(raw).trim().toLowerCase();
            return ["active", "1", "yes", "true"].includes(s)
              ? "active"
              : "inactive";
          };

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
                sessionId,
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
                normalizeStatus(optionalFields.status),
              ];

              values.push(schoolData);

              insertedSchools.push({
                ...school,
                school_code: schoolCode,
                country_id: location.country_id,
                state_id: location.state_id,
                district_id: location.district_id,
                city_id: location.city_id,
                session_id: sessionId,
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
            session_id, board, school_name, school_address, pincode,
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
            if (err && err.code === "ER_DUP_ENTRY") {
              const match = err.sqlMessage.match(/'([^']+)'/);
              const dupEmail = match ? match[1] : "unknown";

              errors.push({
                error: `Duplicate email: ${dupEmail}`,
              });

              return resolve({
                affectedRows: result ? result.affectedRows : 0,
                schools: insertedSchools,
                errors: errors.length ? errors : undefined,
              });
            }

            if (err) {
              return reject({
                message: "Database error during insertion",
                errors: [],
              });
            }

            resolve({
              affectedRows: result.affectedRows,
              schools: insertedSchools,
              errors: errors.length ? errors : undefined,
            });
          });
        } catch (err) {
          reject(new Error(`Processing error: ${err.message}`));
        }
      };

      const sqlGetSessionId = `
      SELECT id FROM gowvell_session 
      WHERE status = 'active' 
      ORDER BY id DESC LIMIT 1
    `;

      db.query(sqlGetSessionId, (err, sessionResults) => {
        if (err) return reject(err);
        if (sessionResults.length === 0) {
          return reject(new Error("No active session found"));
        }
        const sessionId = sessionResults[0].id;
        processSchools(sessionId);
      });
    });
  },

  update: (id, data, callback) => {
    // Ensure 'classes' is valid JSON
    const classes = data.classes ? JSON.stringify(data.classes) : "[]"; // Default empty array

    // ✅ Step 1: Check for duplicate school_name + area_name (excluding same record)
    const checkSql = `
    SELECT id FROM school 
    WHERE school_name = ? AND area_name = ? AND id != ? 
    LIMIT 1
  `;
    db.query(
      checkSql,
      [data.school_name, data.area_name, id],
      (checkErr, checkResult) => {
        if (checkErr) {
          console.error("Error checking duplicate school:", checkErr);
          return callback(checkErr, null);
        }

        if (checkResult.length > 0) {
          return callback(
            new Error("A school with the same name and area already exists"),
            null
          );
        }

        // ✅ Step 2: Proceed with update
        const sql = `
      UPDATE school 
      SET board = ?, school_name = ?, school_email = ?, school_contact_number = ?, 
          school_landline_number = ?, country = ?, state = ?, district = ?, city = ?, pincode = ?, 
          principal_name = ?, principal_contact_number = ?, principal_whatsapp = ?, 
          vice_principal_name = ?, vice_principal_contact_number = ?, 
          vice_principal_whatsapp = ?, classes = ?, status = ?,
          manager_name = ?, manager_contact_number = ?, manager_whatsapp_number = ?,
          first_incharge_name = ?, first_incharge_number = ?, first_incharge_whatsapp = ?,
          second_incharge_name = ?, second_incharge_number = ?, second_incharge_whatsapp = ?,
          junior_student_strength = ?, senior_student_strength = ?, school_address = ?,
          area_name = ?
      WHERE id = ?
    `;

        const values = [
          data.board,
          data.school_name,
          data.school_email,
          data.school_contact_number,
          data.school_landline_number || null,
          data.country || null,
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
          classes,
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
          data.area_name || null,
          id,
        ];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Error updating school:", err);
            return callback(err, null);
          }
          return callback(null, result);
        });
      }
    );
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
              CONCAT(s.id, ':', s.school_name, ':', s.school_code) 
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

  //school- report section
  getByReportId: (id, callback) => {
    const sql = `
      SELECT * FROM school 
      WHERE id = ? OR school_code = ?
    `;
    db.query(sql, [id, id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.length > 0 ? results[0] : null);
    });
  },

  //fees calculate for schools reagarding subject or student
  getByReportIdWithStudentCount: (idOrCity, session_id, callback) => {
    idOrCity = String(idOrCity).trim();
    if (session_id) session_id = String(session_id).trim();

    const isNumeric = !isNaN(Number(idOrCity));

    let baseSql = `
    SELECT s.*, c.name AS city_name, gs.session AS session_name, gs.status AS session_status
    FROM school s
    LEFT JOIN cities c ON s.city = c.id
    LEFT JOIN gowvell_session gs ON s.session_id = gs.id
  `;

    const queryParams = [];
    let whereClauses = [];

    // ✅ Filter by school id/code or city
    if (isNumeric) {
      whereClauses.push("(s.id = ? OR s.city = ?)");
      queryParams.push(idOrCity, idOrCity);
    } else {
      whereClauses.push("(s.school_code = ? OR c.name = ?)");
      queryParams.push(idOrCity, idOrCity);
    }

    // ✅ Session filter (explicit or active)
    if (session_id) {
      whereClauses.push("s.session_id = ?");
      queryParams.push(session_id);
    } else {
      whereClauses.push("(gs.status = 'active' OR gs.status IS NULL)");
    }

    const finalSql = baseSql + " WHERE " + whereClauses.join(" AND ");

    db.query(finalSql, queryParams, (err, schools) => {
      if (err) return callback(err, null);
      if (!schools || schools.length === 0) return callback(null, []);

      let completed = 0;
      const processedSchools = [];

      schools.forEach((school) => {
        processSchool(
          school,
          (err2, processed) => {
            completed++;
            if (!err2 && processed) processedSchools.push(processed);
            if (completed === schools.length) callback(null, processedSchools);
          },
          session_id
        ); // 👈 pass session_id here
      });
    });
  },
};

function processSchool(school, callback, session_id = null) {
  // 🧩 Use provided session or auto-pick active one
  const sessionFilterSql = session_id
    ? "AND s.session_id = ?"
    : "AND s.session_id = (SELECT id FROM gowvell_session WHERE status = 'active' LIMIT 1)";

  const countSql = `
    SELECT COUNT(*) AS student_count,
           s.session_id,
           country, state, district, city
    FROM student s
    WHERE s.school_id = ?
      ${sessionFilterSql}
    GROUP BY s.session_id, country, state, district, city
  `;

  const countParams = session_id ? [school.id, session_id] : [school.id];

  db.query(countSql, countParams, (err, countResult) => {
    if (err) return callback(err, null);

    // 🧮 Summarize student count
    school.student_count = countResult.reduce(
      (sum, r) => sum + r.student_count,
      0
    );
    school.session_id =
      countResult[0]?.session_id || session_id || school.session_id;
    school.location = countResult.map((r) => ({
      country: r.country,
      state: r.state,
      district: r.district,
      city: r.city,
    }));

    // 🔹 Fetch subjects
    const subjectQuery = `SELECT id, name FROM subject_master ORDER BY id ASC`;
    db.query(subjectQuery, (err2, subjectRows) => {
      if (err2) return callback(err2, null);

      const subjectMap = {};
      subjectRows.forEach((s) => (subjectMap[s.id] = s.name));

      // 🔹 Get student subjects (filtered by session)
      const studentSubjectsSql = `
        SELECT s.student_subject, c.name AS class_name
        FROM student s
        LEFT JOIN class c ON s.class_id = c.id
        WHERE s.school_id = ?
          ${sessionFilterSql}
          AND s.student_subject IS NOT NULL
          AND s.student_subject != ''
      `;

      const subjectParams = session_id ? [school.id, session_id] : [school.id];

      db.query(studentSubjectsSql, subjectParams, (err3, studentResults) => {
        if (err3) return callback(err3, null);

        const classSubjectSummary = {};
        let totalSubjectCount = 0;

        studentResults.forEach((row) => {
          let subjects = row.student_subject;
          const className = row.class_name || "Unknown";

          try {
            if (typeof subjects === "string") {
              try {
                subjects = JSON.parse(subjects);
              } catch {
                subjects = subjects
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
              }
            }
            if (typeof subjects === "number") subjects = [subjects];
            if (!Array.isArray(subjects)) return;

            const uniqueSubjects = Array.from(new Set(subjects.map(String)));
            if (!classSubjectSummary[className])
              classSubjectSummary[className] = {};

            uniqueSubjects.forEach((subjId) => {
              const key = parseInt(subjId, 10);
              if (!isNaN(key)) {
                const subjName = subjectMap[key] || `Subject-${key}`;
                classSubjectSummary[className][subjName] =
                  (classSubjectSummary[className][subjName] || 0) + 1;
                totalSubjectCount++;
              }
            });
          } catch (e) {
            console.error(
              "Invalid student_subject:",
              row.student_subject,
              e.message
            );
          }
        });

        school.subject_summary = {
          total_subject: totalSubjectCount,
          classes: classSubjectSummary,
        };

        callback(null, school);
      });
    });
  });
}

export default School;
