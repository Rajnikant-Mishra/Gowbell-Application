import { db } from "../../config/db.js";

const SchoolStudentModel = {
  // Total schools count
  // getTotalSchools: (filters = {}) => {
  //   return new Promise((resolve, reject) => {
  //     let sql = `SELECT COUNT(*) as total
  //                FROM school i
  //                JOIN gowvell_session gs ON i.session_id = gs.id`;
  //     const values = [];

  //     // --- Session filter ---
  //     if (filters.session_id) {
  //       sql += " WHERE i.session_id = ?";
  //       values.push(filters.session_id);
  //     } else {
  //       sql += " WHERE gs.status = 'active'";
  //     }

  //     if (filters.country) {
  //       sql += " AND i.country = ?";
  //       values.push(filters.country);
  //     }
  //     if (filters.state) {
  //       sql += " AND i.state = ?";
  //       values.push(filters.state);
  //     }
  //     if (filters.district) {
  //       sql += " AND i.district = ?";
  //       values.push(filters.district);
  //     }
  //     if (filters.city) {
  //       sql += " AND i.city = ?";
  //       values.push(filters.city);
  //     }

  //     db.query(sql, values, (err, results) => {
  //       if (err) return reject(err);
  //       resolve(results[0].total);
  //     });
  //   });
  // },

  getTotalSchoolsWithChange: (filters = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Current session total
        let sqlCurrent = `
        SELECT COUNT(*) as total 
        FROM school i
        JOIN gowvell_session gs ON i.session_id = gs.id
      `;
        const valuesCurrent = [];

        if (filters.session_id) {
          sqlCurrent += " WHERE i.session_id = ?";
          valuesCurrent.push(filters.session_id);
        } else {
          sqlCurrent += " WHERE gs.status = 'active'";
        }

        if (filters.country)
          (sqlCurrent += " AND i.country = ?"),
            valuesCurrent.push(filters.country);
        if (filters.state)
          (sqlCurrent += " AND i.state = ?"), valuesCurrent.push(filters.state);
        if (filters.district)
          (sqlCurrent += " AND i.district = ?"),
            valuesCurrent.push(filters.district);
        if (filters.city)
          (sqlCurrent += " AND i.city = ?"), valuesCurrent.push(filters.city);

        const currentResult = await new Promise((res, rej) => {
          db.query(sqlCurrent, valuesCurrent, (err, results) => {
            if (err) return rej(err);
            res(results[0].total);
          });
        });

        // Previous session total
        let sqlPrev = `
        SELECT COUNT(*) as total 
        FROM school i
        JOIN gowvell_session gs ON i.session_id = gs.id
      `;
        const valuesPrev = [];

        if (filters.session_id) {
          sqlPrev +=
            " WHERE i.session_id = (SELECT id FROM gowvell_session WHERE id < ? ORDER BY id DESC LIMIT 1)";
          valuesPrev.push(filters.session_id);
        } else {
          sqlPrev += " WHERE gs.status = 'inactive'";
        }

        if (filters.country)
          (sqlPrev += " AND i.country = ?"), valuesPrev.push(filters.country);
        if (filters.state)
          (sqlPrev += " AND i.state = ?"), valuesPrev.push(filters.state);
        if (filters.district)
          (sqlPrev += " AND i.district = ?"), valuesPrev.push(filters.district);
        if (filters.city)
          (sqlPrev += " AND i.city = ?"), valuesPrev.push(filters.city);

        const prevResult = await new Promise((res, rej) => {
          db.query(sqlPrev, valuesPrev, (err, results) => {
            if (err) return rej(err);
            res(results[0].total);
          });
        });

        // Calculate percentage change
        let percentageChange = 0;
        if (prevResult > 0) {
          percentageChange = ((currentResult - prevResult) / prevResult) * 100;
        }

        resolve({
          totalSchools: currentResult,
          percentageChange: percentageChange.toFixed(2), // optional: keep 2 decimals
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  // Total students count
  // getTotalStudents: (filters = {}) => {
  //   return new Promise((resolve, reject) => {
  //     let sql = `SELECT COUNT(*) as total
  //                FROM student i
  //                JOIN gowvell_session gs ON i.session_id = gs.id`;
  //     const values = [];

  //     // --- Session filter ---
  //     if (filters.session_id) {
  //       sql += " WHERE i.session_id = ?";
  //       values.push(filters.session_id);
  //     } else {
  //       sql += " WHERE gs.status = 'active'";
  //     }

  //     if (filters.country) {
  //       sql += " AND i.country = ?";
  //       values.push(filters.country);
  //     }
  //     if (filters.state) {
  //       sql += " AND i.state = ?";
  //       values.push(filters.state);
  //     }
  //     if (filters.district) {
  //       sql += " AND i.district = ?";
  //       values.push(filters.district);
  //     }
  //     if (filters.city) {
  //       sql += " AND i.city = ?";
  //       values.push(filters.city);
  //     }

  //     db.query(sql, values, (err, results) => {
  //       if (err) return reject(err);
  //       resolve(results[0].total);
  //     });
  //   });
  // },

  getTotalStudentsWithChange: (filters = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Current session total
        let sqlCurrent = `
        SELECT COUNT(*) as total 
        FROM student i
        JOIN gowvell_session gs ON i.session_id = gs.id
      `;
        const valuesCurrent = [];

        if (filters.session_id) {
          sqlCurrent += " WHERE i.session_id = ?";
          valuesCurrent.push(filters.session_id);
        } else {
          sqlCurrent += " WHERE gs.status = 'active'";
        }

        if (filters.country)
          (sqlCurrent += " AND i.country = ?"),
            valuesCurrent.push(filters.country);
        if (filters.state)
          (sqlCurrent += " AND i.state = ?"), valuesCurrent.push(filters.state);
        if (filters.district)
          (sqlCurrent += " AND i.district = ?"),
            valuesCurrent.push(filters.district);
        if (filters.city)
          (sqlCurrent += " AND i.city = ?"), valuesCurrent.push(filters.city);

        const currentResult = await new Promise((res, rej) => {
          db.query(sqlCurrent, valuesCurrent, (err, results) => {
            if (err) return rej(err);
            res(results[0].total);
          });
        });

        // Previous session total
        let sqlPrev = `
        SELECT COUNT(*) as total 
        FROM student i
        JOIN gowvell_session gs ON i.session_id = gs.id
      `;
        const valuesPrev = [];

        if (filters.session_id) {
          sqlPrev +=
            " WHERE i.session_id = (SELECT id FROM gowvell_session WHERE id < ? ORDER BY id DESC LIMIT 1)";
          valuesPrev.push(filters.session_id);
        } else {
          sqlPrev += " WHERE gs.status = 'inactive'";
        }

        if (filters.country)
          (sqlPrev += " AND i.country = ?"), valuesPrev.push(filters.country);
        if (filters.state)
          (sqlPrev += " AND i.state = ?"), valuesPrev.push(filters.state);
        if (filters.district)
          (sqlPrev += " AND i.district = ?"), valuesPrev.push(filters.district);
        if (filters.city)
          (sqlPrev += " AND i.city = ?"), valuesPrev.push(filters.city);

        const prevResult = await new Promise((res, rej) => {
          db.query(sqlPrev, valuesPrev, (err, results) => {
            if (err) return rej(err);
            res(results[0].total);
          });
        });

        // Calculate percentage change
        let percentageChange = 0;
        if (prevResult > 0) {
          percentageChange = ((currentResult - prevResult) / prevResult) * 100;
        }

        resolve({
          totalStudents: currentResult,
          percentageChange: percentageChange.toFixed(2),
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  // Calculate average percentage
  // calculateAveragePercentage: async (filters = {}) => {
  //   let sql = `
  //   SELECT AVG(r.percentage) AS average_percentage
  //   FROM result r
  //   JOIN school s ON r.school_id = s.id
  //   JOIN gowvell_session gs ON r.session_id = gs.id
  //   WHERE r.percentage IS NOT NULL
  // `;
  //   const values = [];

  //   // --- Session filter ---
  //   if (filters.session_id) {
  //     sql += " AND r.session_id = ?";
  //     values.push(filters.session_id);
  //   } else {
  //     sql += " AND gs.status = 'active'";
  //   }

  //   // --- Location filters (from school table) ---
  //   if (filters.country) {
  //     sql += " AND s.country = ?";
  //     values.push(filters.country);
  //   }
  //   if (filters.state) {
  //     sql += " AND s.state = ?";
  //     values.push(filters.state);
  //   }
  //   if (filters.district) {
  //     sql += " AND s.district = ?";
  //     values.push(filters.district);
  //   }
  //   if (filters.city) {
  //     sql += " AND s.city = ?";
  //     values.push(filters.city);
  //   }

  //   return new Promise((resolve, reject) => {
  //     db.query(sql, values, (err, result) => {
  //       if (err) return reject(err);
  //       const avg = result[0]?.average_percentage || 0;
  //       resolve({
  //         message: "Average percentage calculated successfully",
  //         average_percentage: avg,
  //       });
  //     });
  //   });
  // },

calculateAveragePercentage: async (filters = {}) => {
  try {
    // Current session average
    let sqlCurrent = `
      SELECT AVG(r.percentage) AS average_percentage
      FROM result r
      JOIN school s ON r.school_id = s.id
      JOIN gowvell_session gs ON r.session_id = gs.id
      WHERE r.percentage IS NOT NULL
    `;
    const valuesCurrent = [];

    if (filters.session_id) {
      sqlCurrent += " AND r.session_id = ?";
      valuesCurrent.push(filters.session_id);
    } else {
      sqlCurrent += " AND gs.status = 'active'";
    }

    if (filters.country) sqlCurrent += " AND s.country = ?", valuesCurrent.push(filters.country);
    if (filters.state) sqlCurrent += " AND s.state = ?", valuesCurrent.push(filters.state);
    if (filters.district) sqlCurrent += " AND s.district = ?", valuesCurrent.push(filters.district);
    if (filters.city) sqlCurrent += " AND s.city = ?", valuesCurrent.push(filters.city);

    const currentAvg = await new Promise((resolve, reject) => {
      db.query(sqlCurrent, valuesCurrent, (err, result) => {
        if (err) return reject(err);
        // Ensure we return a number, not null
        resolve(result[0]?.average_percentage !== null ? Number(result[0].average_percentage) : 0);
      });
    });

    // Previous session average
    let sqlPrev = `
      SELECT AVG(r.percentage) AS average_percentage
      FROM result r
      JOIN school s ON r.school_id = s.id
      JOIN gowvell_session gs ON r.session_id = gs.id
      WHERE r.percentage IS NOT NULL
    `;
    const valuesPrev = [];

    if (filters.session_id) {
      sqlPrev += " AND r.session_id = (SELECT id FROM gowvell_session WHERE id < ? ORDER BY id DESC LIMIT 1)";
      valuesPrev.push(filters.session_id);
    } else {
      sqlPrev += " AND gs.status = 'inactive'";
    }

    if (filters.country) sqlPrev += " AND s.country = ?", valuesPrev.push(filters.country);
    if (filters.state) sqlPrev += " AND s.state = ?", valuesPrev.push(filters.state);
    if (filters.district) sqlPrev += " AND s.district = ?", valuesPrev.push(filters.district);
    if (filters.city) sqlPrev += " AND s.city = ?", valuesPrev.push(filters.city);

    const prevAvg = await new Promise((resolve, reject) => {
      db.query(sqlPrev, valuesPrev, (err, result) => {
        if (err) return reject(err);
        resolve(result[0]?.average_percentage !== null ? Number(result[0].average_percentage) : 0);
      });
    });

    // Calculate percentage change safely
    let percentageChange = 0;
    if (prevAvg > 0) {
      percentageChange = ((currentAvg - prevAvg) / prevAvg) * 100;
    }

    return {
      average_percentage: parseFloat(currentAvg.toFixed(2)),
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      message: "Average percentage calculated successfully",
    };
  } catch (err) {
    throw err;
  }
},

  // 🏅 Medal distribution (Gold, Silver, Bronze)
  getMedalCounts: (filters = {}) => {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT 
          SUM(CASE WHEN i.medals = 'Gold' THEN 1 ELSE 0 END) AS gold,
          SUM(CASE WHEN i.medals = 'Silver' THEN 1 ELSE 0 END) AS silver,
          SUM(CASE WHEN i.medals = 'Bronze' THEN 1 ELSE 0 END) AS bronze
        FROM result i
        JOIN gowvell_session gs ON i.session_id = gs.id
        WHERE i.status = 'success'
      `;
      const values = [];

      // --- Session filter ---
      if (filters.session_id) {
        sql += " AND i.session_id = ?";
        values.push(filters.session_id);
      } else {
        sql += " AND gs.status = 'active'";
      }

      db.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // { gold: x, silver: y, bronze: z }
      });
    });
  },

  // 📘 Get all exams with school name
  // getExamsBySchool: (filters = {}) => {
  //   return new Promise((resolve, reject) => {
  //     let sql = `
  //       SELECT e.*, s.school_name AS school_name
  //       FROM exam e
  //       JOIN school s ON e.school_id = s.id
  //       JOIN gowvell_session gs ON e.session_id = gs.id
  //     `;
  //     const values = [];

  //     // --- Session filter ---
  //     if (filters.session_id) {
  //       sql += " WHERE e.session_id = ?";
  //       values.push(filters.session_id);
  //     } else {
  //       sql += " WHERE gs.status = 'active'";
  //     }

  //     db.query(sql, values, (err, results) => {
  //       if (err) return reject(err);
  //       resolve(results);
  //     });
  //   });
  // },
  getExamsBySchool: (filters = {}) => {
    return new Promise((resolve, reject) => {
      let sql = `
      SELECT e.*, s.school_name AS school_name
      FROM exam e
      JOIN school s ON e.school_id = s.id
      JOIN gowvell_session gs ON e.session_id = gs.id
    `;
      const values = [];
      const conditions = [];

      // --- Session filter ---
      if (filters.session_id) {
        conditions.push("e.session_id = ?");
        values.push(filters.session_id);
      } else {
        conditions.push("gs.status = 'active'");
      }

      // --- Location filters from exam table ---
      if (filters.country) {
        conditions.push("e.country = ?");
        values.push(filters.country);
      }
      if (filters.state) {
        conditions.push("e.state = ?");
        values.push(filters.state);
      }
      if (filters.district) {
        conditions.push("e.district = ?");
        values.push(filters.district);
      }
      if (filters.city) {
        conditions.push("e.city = ?");
        values.push(filters.city);
      }

      // Build WHERE clause
      if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
      }

      db.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // 📊 Get participation per year
  getParticipationPerYear: () => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
        s.id AS session_id,
        s.session,
        YEAR(st.created_at) AS year,
        COUNT(st.id) AS total_students
      FROM gowvell_session s
      LEFT JOIN student st ON st.session_id = s.id
      GROUP BY s.id, YEAR(st.created_at)
      ORDER BY year DESC
    `;

      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // GET ALL omr data
  getAllomrdata: (filters = {}) => {
    return new Promise((resolve, reject) => {
      let query = `
      SELECT o.* 
      FROM omr_data o
    `;

      const values = [];
      const conditions = [];

      // --- Location filters directly from omr_data table ---
      if (filters.country) {
        conditions.push("o.country = ?");
        values.push(filters.country);
      }
      if (filters.state) {
        conditions.push("o.state = ?");
        values.push(filters.state);
      }
      if (filters.district) {
        conditions.push("o.district = ?");
        values.push(filters.district);
      }
      if (filters.city) {
        conditions.push("o.city = ?");
        values.push(filters.city);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      // ✅ Only one ORDER BY
      query += " ORDER BY o.created_at DESC";

      db.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getSubjectCounts: (filters = {}, callback) => {
    const subjectQuery = `
    SELECT id, name 
    FROM subject_master 
    ORDER BY id ASC
  `;

    db.query(subjectQuery, (err, subjectRows) => {
      if (err) return callback(err);

      let studentQuery = `
      SELECT s.student_subject 
      FROM student s
      JOIN school sch ON s.school_id = sch.id
      JOIN gowvell_session gs ON s.session_id = gs.id
    `;
      const values = [];
      const conditions = [];

      // --- Session filter ---
      if (filters.session_id) {
        conditions.push("s.session_id = ?");
        values.push(filters.session_id);
      } else {
        conditions.push("gs.status = 'active'");
      }

      // --- Location filters ---
      if (filters.country) {
        conditions.push("sch.country = ?");
        values.push(filters.country);
      }
      if (filters.state) {
        conditions.push("sch.state = ?");
        values.push(filters.state);
      }
      if (filters.district) {
        conditions.push("sch.district = ?");
        values.push(filters.district);
      }
      if (filters.city) {
        conditions.push("sch.city = ?");
        values.push(filters.city);
      }

      // Only non-empty student_subject
      conditions.push(
        "s.student_subject IS NOT NULL AND s.student_subject != ''"
      );

      if (conditions.length > 0) {
        studentQuery += " WHERE " + conditions.join(" AND ");
      }

      db.query(studentQuery, values, (err, studentResults) => {
        if (err) return callback(err);

        const subjectCounts = {};
        let totalCount = 0;

        studentResults.forEach((row) => {
          let subjects = row.student_subject;

          try {
            if (typeof subjects === "string") subjects = JSON.parse(subjects);
            if (typeof subjects === "number") subjects = [subjects];
            if (!Array.isArray(subjects)) return;

            subjects.forEach((subjId) => {
              const key = parseInt(subjId, 10);
              if (!isNaN(key)) {
                subjectCounts[key] = (subjectCounts[key] || 0) + 1;
                totalCount++;
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

        const result = subjectRows.map((subj) => ({
          id: subj.id,
          name: subj.name,
          count: subjectCounts[subj.id] || 0,
        }));

        callback(null, {
          total_count: totalCount,
          subjects: result,
        });
      });
    });
  },
};

export default SchoolStudentModel;
