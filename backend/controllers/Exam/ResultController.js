import ResultModel from "../../models/Exam/ResultModel.js";
import { db } from "../../config/db.js";
import { logActivity } from "../../models/dashboard/activityModel.js";

// Create a single result
// export const createResult = (req, res) => {
//   const userId = req.user?.id || "system";
//   const userName = req.user?.name || "System";

//   ResultModel.create(req.body, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     // ✅ Activity Log
//     try {
//       logActivity({
//         user_id: userId,
//         user_name: userName,
//         activity: "Result has been created",
//         data: { resultId: result.insertId, resultData: req.body },
//         ip_address: req.ip || req.socket?.remoteAddress || null,
//       });
//     } catch (logErr) {
//       console.error("Activity Log Error:", logErr.message);
//     }

//     res.status(201).json(result);
//   });
// };

export const createResult = (req, res) => {
  const userId = req.user?.id || "system";
  const userName = req.user?.name || "System";

  const {
    school_id,
    class_id,
    subject_id,
    roll_no,
    full_mark,
    mark_secured,
    student_name,
    level,
    session_id,
  } = req.body;

  if (!student_name || !school_id || !class_id || !subject_id) {
    return res.status(400).json({
      error:
        "Missing required fields: student_name, school_id, class_id, and subject_id are mandatory.",
    });
  }

  const payload = {
    school_id,
    student_name: student_name?.trim() || "",
    class_id,
    subject_id,
    roll_no,
    full_mark,
    mark_secured,
    level,
    session_id,
  };

  ResultModel.create(payload, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Activity log
    try {
      logActivity({
        user_id: userId,
        user_name: userName,
        activity: "Result created",
        data: {
          resultId: result.id,
          resultData: payload,
        },
        ip_address: req.ip || req.socket?.remoteAddress || null,
      });
    } catch (logErr) {
      console.error("Activity Log Error:", logErr.message);
    }

    res.status(201).json({
      message: "Result created successfully",
      result,
    });
  });
};

// Update
export const updateResult = (req, res) => {
  const id = req.params.id;
  const userId = req.user?.id || "system";
  const userName = req.user?.name || "System";

  ResultModel.update(id, req.body, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });

    // ✅ Activity Log
    try {
      logActivity({
        user_id: userId,
        user_name: userName,
        activity: `Result  has been updated`,
        data: { resultId: id, updatedFields: req.body },
        ip_address: req.ip || req.socket?.remoteAddress || null,
      });
    } catch (logErr) {
      console.error("Activity Log Error:", logErr.message);
    }

    res.status(200).json(result);
  });
};

// Get by ID
export const getResultById = (req, res) => {
  const id = req.params.id;
  ResultModel.getById(id, (err, result) => {
    if (err) return res.status(404).json({ error: err.message });
    res.status(200).json(result);
  });
};

// export const bulkUploadResults = (req, res) => {
//   const students = req.body.students;

//   // Validate input
//   if (!Array.isArray(students) || students.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid input: students array is required and cannot be empty.",
//     });
//   }

//   // Additional validation for array elements
//   for (const [index, student] of students.entries()) {
//     if (
//       !student.student_name ||
//       !student.school_name ||
//       !student.class_name ||
//       !student.subject
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields for student at index ${index}`,
//       });
//     }
//   }

//   ResultModel.bulkUpload(students)
//     .then((response) => {
//       res.status(200).json({
//         success: true,
//         message: response.message,
//       });
//     })
//     .catch((err) => {
//       console.error("Error during bulk upload:", err);
//       res.status(500).json({
//         success: false,
//         message:
//           err.message || "Failed to upload results. Please try again later.",
//       });
//     });
// };

export const bulkUploadResults = (req, res) => {
  const students = req.body.students;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid input: students array is required and cannot be empty.",
    });
  }

  for (const [index, student] of students.entries()) {
    if (
      !student.student_name ||
      !student.school_name ||
      !student.class_name ||
      !student.subject
    ) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields for student at index ${index}`,
      });
    }
  }

  ResultModel.bulkUpload(students)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: response.message,
      });
    })
    .catch((err) => {
      console.error("Error during bulk upload:", err);
      res.status(500).json({
        success: false,
        message:
          err.message || "Failed to upload results. Please try again later.",
      });
    });
};

// Get all results paginate serach also
export const getAllResults = (req, res) => {
  let { page = 1, limit = 10, session_id = null } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  ResultModel.getAllResults(page, limit, session_id, (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching results",
        error: err.message,
      });
    }
    res
      .status(200)
      .json({ success: true, session_id: session_id || "active", ...data });
  });
};

// Delete by ID
export const deleteResultById = (req, res) => {
  const id = req.params.id;
  const userId = req.user?.id || "system";
  const userName = req.user?.name || "System";

  ResultModel.deleteById(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Internal server error", details: err });
    }

    // ✅ Activity Log
    try {
      logActivity({
        user_id: userId,
        user_name: userName,
        activity: `Result  has been deleted`,
        data: { resultId: id },
        ip_address: req.ip || req.socket?.remoteAddress || null,
      });
    } catch (logErr) {
      console.error("Activity Log Error:", logErr.message);
    }

    res.json(result);
  });
};

// Update percentages for pending students
// export const getFilteredStudentsomrreceipt = (req, res) => {
//   try {
//     const {
//       schoolId,
//       classIds,
//       subjectIds,
//       updatePending = false,
//       session_id,
//     } = req.body;

//     // Validate inputs
//     if (
//       !schoolId ||
//       !Array.isArray(classIds) ||
//       classIds.length === 0 ||
//       !Array.isArray(subjectIds) ||
//       subjectIds.length === 0
//     ) {
//       return res.status(400).json({
//         error:
//           "Invalid input data: schoolId, classIds (array), and subjectIds (array) are required",
//       });
//     }

//     // Step 1: Resolve session_id
//     const resolveSessionId = (next) => {
//       if (session_id) {
//         const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
//         db.query(verifyQuery, [session_id], (err, result) => {
//           if (err)
//             return res
//               .status(500)
//               .json({ error: "DB error", details: err.message });
//           if (result.length === 0) {
//             return res
//               .status(400)
//               .json({ error: "Invalid session ID selected" });
//           }
//           return next(session_id);
//         });
//       } else {
//         const sessionQuery = `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`;
//         db.query(sessionQuery, (err, result) => {
//           if (err)
//             return res
//               .status(500)
//               .json({ error: "DB error", details: err.message });
//           if (result.length === 0) {
//             return res.status(400).json({ error: "No active session found" });
//           }
//           return next(result[0].id);
//         });
//       }
//     };

//     // Step 2: Core student fetch logic
//     const fetchStudents = (resolvedSessionId) => {
//       ResultModel.getStudents(
//         schoolId,
//         classIds,
//         subjectIds,
//         resolvedSessionId,
//         (err, result) => {
//           if (err) {
//             return res.status(500).json({
//               error: "Failed to fetch students",
//               details: err.message,
//             });
//           }

//           const { students, totalCount } = result;

//           ResultModel.getClassNames(classIds, (err, classNames) => {
//             if (err) {
//               return res.status(500).json({
//                 error: "Failed to fetch class names",
//                 details: err.message,
//               });
//             }

//             ResultModel.getSubjectNames(subjectIds, (err, subjectNames) => {
//               if (err) {
//                 return res.status(500).json({
//                   error: "Failed to fetch subject names",
//                   details: err.message,
//                 });
//               }

//               res.json({
//                 students,
//                 totalCount,
//                 classNames,
//                 subjectNames,
//                 session_id: resolvedSessionId,
//                 message: `Successfully retrieved ${totalCount} students for School ${schoolId}`,
//               });
//             });
//           });
//         }
//       );
//     };

//     // Step 3: Update pending percentages first if required
//     resolveSessionId((resolvedSessionId) => {
//       if (updatePending) {
//         ResultModel.updatePendingPercentages(
//           schoolId,
//           classIds,
//           subjectIds,
//           (err) => {
//             if (err) {
//               return res.status(500).json({
//                 error: "Failed to update pending records",
//                 details: err.message,
//               });
//             }
//             fetchStudents(resolvedSessionId);
//           }
//         );
//       } else {
//         fetchStudents(resolvedSessionId);
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };

export const getFilteredStudentsomrreceipt = (req, res) => {
  try {
    const {
      schoolId,
      classIds,
      subjectIds,
      updatePending = false,
      session_id,
    } = req.body;

    // Validate inputs
    if (
      !schoolId ||
      !Array.isArray(classIds) ||
      classIds.length === 0 ||
      !Array.isArray(subjectIds) ||
      subjectIds.length === 0
    ) {
      return res.status(400).json({
        error:
          "Invalid input data: schoolId, classIds (array), and subjectIds (array) are required",
      });
    }

    // Step 1: Resolve session_id
    const resolveSessionId = (next) => {
      if (session_id) {
        const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
        db.query(verifyQuery, [session_id], (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ error: "DB error", details: err.message });
          if (result.length === 0) {
            return res
              .status(400)
              .json({ error: "Invalid session ID selected" });
          }
          return next(session_id);
        });
      } else {
        const sessionQuery = `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`;
        db.query(sessionQuery, (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ error: "DB error", details: err.message });
          if (result.length === 0) {
            return res.status(400).json({ error: "No active session found" });
          }
          return next(result[0].id);
        });
      }
    };

    // Step 2: Fetch students
    const fetchStudents = (resolvedSessionId) => {
      ResultModel.getStudents(
        schoolId,
        classIds,
        subjectIds,
        resolvedSessionId,
        (err, result) => {
          if (err) {
            return res.status(500).json({
              error: "Failed to fetch students",
              details: err.message,
            });
          }

          const { students, totalCount } = result;

          ResultModel.getClassNames(classIds, (err, classNames) => {
            if (err) {
              return res.status(500).json({
                error: "Failed to fetch class names",
                details: err.message,
              });
            }

            ResultModel.getSubjectNames(subjectIds, (err, subjectNames) => {
              if (err) {
                return res.status(500).json({
                  error: "Failed to fetch subject names",
                  details: err.message,
                });
              }

              res.json({
                students,
                totalCount,
                classNames,
                subjectNames,
                session_id: resolvedSessionId,
                message: `Successfully retrieved ${totalCount} students for School ${schoolId}`,
              });
            });
          });
        }
      );
    };

    // Step 3: Update pending percentages and student levels if required
    resolveSessionId((resolvedSessionId) => {
      if (updatePending) {
        ResultModel.updatePendingPercentages(
          schoolId,
          classIds,
          subjectIds,
          (err) => {
            if (err) {
              return res.status(500).json({
                error: "Failed to update pending records",
                details: err.message,
              });
            }
            // After updating percentages and student levels, fetch students
            fetchStudents(resolvedSessionId);
          }
        );
      } else {
        fetchStudents(resolvedSessionId);
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

//medal updated
export const updateMedal = (req, res) => {
  const { id, certificate } = req.body;

  if (!id || !certificate) {
    return res.status(400).json({ message: "id and medal are required" });
  }

  ResultModel.updateMedal(id, certificate, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(data);
  });
};

//report award rsult achiements
export const getFilteredStudentsforEvalute = (req, res) => {
  try {
    const {
      schoolId,
      subjectIds,
      certificate = null,
      updatePending = false,
      session_id,
    } = req.body;

    if (!schoolId || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({
        error:
          "Invalid input data: schoolId and subjectIds (array) are required",
      });
    }

    const resolveSessionId = (next) => {
      if (session_id) {
        const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
        db.query(verifyQuery, [session_id], (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ error: "DB error", details: err.message });
          if (result.length === 0)
            return res
              .status(400)
              .json({ error: "Invalid session ID selected" });
          next(session_id);
        });
      } else {
        const sessionQuery = `SELECT id FROM gowvell_session WHERE status = 'active' ORDER BY id DESC LIMIT 1`;
        db.query(sessionQuery, (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ error: "DB error", details: err.message });
          if (result.length === 0)
            return res.status(400).json({ error: "No active session found" });
          next(result[0].id);
        });
      }
    };

    const fetchStudents = (resolvedSessionId) => {
      ResultModel.getEvaluteStudents(
        schoolId,
        subjectIds,
        resolvedSessionId,
        certificate,
        (err, result) => {
          if (err)
            return res.status(500).json({
              error: "Failed to fetch students",
              details: err.message,
            });

          const { students, totalCount } = result;

          ResultModel.getSubjectNames(subjectIds, (err, subjectNames) => {
            if (err)
              return res.status(500).json({
                error: "Failed to fetch subject names",
                details: err.message,
              });

            res.json({
              students,
              totalCount,
              subjectNames,
              session_id: resolvedSessionId,
              message: `Successfully retrieved ${totalCount} students for School ${schoolId}`,
            });
          });
        }
      );
    };

    resolveSessionId((resolvedSessionId) => {
      if (updatePending) {
        ResultModel.updatePendingPercentages(
          schoolId,
          [],
          subjectIds,
          (err) => {
            if (err)
              return res.status(500).json({
                error: "Failed to update pending records",
                details: err.message,
              });
            fetchStudents(resolvedSessionId);
          }
        );
      } else {
        fetchStudents(resolvedSessionId);
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
