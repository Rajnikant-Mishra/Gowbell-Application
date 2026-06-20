import ResultModel from "../../models/Results/result.model.js";
import { db } from "../../config/db.js";
import { logActivity } from "../../models/dashboard/activityModel.js";

// Create a single result
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

//bulkUpload-controller
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

//bulkuploadbystaff
export const bulkUploadResultsbystaff = async (req, res) => {
  try {
    const students = req.body.students;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input: students array is required and cannot be empty.",
      });
    }

    // Optional: basic validation (detailed in model)
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

    const response = await ResultModel.bulkUploadbystaff(students);

    res.status(200).json({
      success: true,
      message: response.message,
    });
  } catch (err) {
    console.error("Error during bulk upload by staff:", err);
    res.status(500).json({
      success: false,
      message:
        err.message || "Failed to upload results. Please try again later.",
    });
  }
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

// Update percentages for pending students with school, classes, subject, level result student
export const getFilteredStudentsomrreceipt = (req, res) => {
  try {
    const {
      schoolIds,
      classIds = [],
      subjectIds = [],
      level,
      updatePending = false,
      session_id,
    } = req.body;

    // Validate required fields
    if (!Array.isArray(schoolIds) || schoolIds.length === 0 || !level) {
      return res.status(400).json({
        error:
          "Invalid input: 'schoolIds' must be an array (at least one value) and 'level' is required.",
      });
    }

    // Resolve session ID (either provided or active one)
    const resolveSessionId = (next) => {
      if (session_id) {
        const verifyQuery = `SELECT id FROM gowvell_session WHERE id = ?`;
        db.query(verifyQuery, [session_id], (err, result) => {
          if (err)
            return res.status(500).json({
              error: "Database error verifying session",
              details: err.message,
            });
          if (result.length === 0)
            return res
              .status(400)
              .json({ error: "Invalid session ID provided" });
          return next(session_id);
        });
      } else {
        const sessionQuery = `
          SELECT id
          FROM gowvell_session
          WHERE status = 'active'
          ORDER BY id DESC
          LIMIT 1
        `;
        db.query(sessionQuery, (err, result) => {
          if (err)
            return res.status(500).json({
              error: "Database error fetching session",
              details: err.message,
            });
          if (result.length === 0)
            return res.status(400).json({ error: "No active session found" });
          return next(result[0].id);
        });
      }
    };

    // Main function to fetch filtered students
    const fetchStudents = (resolvedSessionId) => {
      ResultModel.getStudents(
        schoolIds,
        classIds,
        subjectIds,
        resolvedSessionId,
        level,
        (err, result) => {
          if (err)
            return res.status(500).json({
              error: "Failed to fetch student data",
              details: err.message,
            });

          const { students, totalCount } = result;

          // Fetch class and subject names (optional filters)
          ResultModel.getClassNames(classIds, (err, classNames) => {
            if (err)
              return res.status(500).json({
                error: "Failed to fetch class names",
                details: err.message,
              });

            ResultModel.getSubjectNames(subjectIds, (err, subjectNames) => {
              if (err)
                return res.status(500).json({
                  error: "Failed to fetch subject names",
                  details: err.message,
                });

              return res.json({
                success: true,
                schoolIds,
                session_id: resolvedSessionId,
                totalCount,
                students,
                classNames,
                subjectNames,
                level,
                message: `Successfully retrieved ${totalCount} students for Level "${level}".`,
              });
            });
          });
        },
      );
    };

    //  Resolve session and process updates/fetch
    resolveSessionId((resolvedSessionId) => {
      if (updatePending) {
        //  First update pending percentages before fetching students
        ResultModel.updatePendingPercentages(
          schoolIds,
          classIds,
          subjectIds,
          level,
          (err, updateResult) => {
            if (err) {
              console.error("Error updating pending results:", err);
              return res.status(500).json({
                error: "Failed to update pending student results",
                details: err.message,
              });
            }

            console.log("Update Summary:", updateResult.message);
            // After successful update, fetch student list
            fetchStudents(resolvedSessionId);
          },
        );
      } else {
        // No update needed → fetch directly
        fetchStudents(resolvedSessionId);
      }
    });
  } catch (err) {
    console.error(" Error in getFilteredStudentsomrreceipt:", err);
    return res.status(500).json({
      error: "Unexpected server error",
      details: err.message,
    });
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
        },
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
          },
        );
      } else {
        fetchStudents(resolvedSessionId);
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

//updated medal wild card
export const updateMedalWild = (req, res) => {
  const { id, medals } = req.body;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  ResultModel.updateMedalforWildCard(id, medals, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(data);
  });
};




//resulkt send email for result process stduents
export const getFilteredStudentsByResult = async (req, res) => {
  try {
    const {
      schoolIds,
      classIds = [],
      subjectIds = [],
      level,
      session_id,
    } = req.body;

    // Validation
    if (!Array.isArray(schoolIds) || schoolIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "schoolIds must be a non-empty array",
      });
    }

    if (!level) {
      return res.status(400).json({
        success: false,
        error: "level is required",
      });
    }

    // Resolve session
    let resolvedSessionId = session_id;

    if (!resolvedSessionId) {
      const [session] = await db.promise().query(`
        SELECT id
        FROM gowvell_session
        WHERE status = 'active'
        ORDER BY id DESC
        LIMIT 1
      `);

      if (!session.length) {
        return res.status(400).json({
          success: false,
          error: "No active session found",
        });
      }

      resolvedSessionId = session[0].id;
    }

    // Fetch data
    const { students, totalCount } = await ResultModel.getStudentsByResults({
      schoolIds,
      classIds,
      subjectIds,
      sessionId: resolvedSessionId,
      level,
    });

    // No data case
    if (!students.length) {
      return res.json({
        success: true,
        totalCount: 0,
        data: {},
        message: "No successful results found",
      });
    }

    // Group by school (IMPORTANT for PDF/email)
    const groupedBySchool = students.reduce((acc, student) => {
      const schoolId = student.school_id;

      if (!acc[schoolId]) {
        acc[schoolId] = {
          school_name: student.school_name,
          school_email: student.school_email,
          school_code: student.school_code,
          school_address:student.school_address,
          students: [],
        };
      }

      acc[schoolId].students.push(student);

      return acc;
    }, {});

    return res.json({
      success: true,
      totalCount,
      data: groupedBySchool,
      filters: {
        schoolIds,
        classIds,
        subjectIds,
        level,
        session_id: resolvedSessionId,
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
