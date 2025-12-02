import Student from "../../models/Student/studentModel.js";
import { logActivity } from "../../models/dashboard/activityModel.js";

// export const createStudent = (req, res) => {
//   const {
//     school_id,
//     student_name,
//     class_id,
//     student_section,
//     mobile_number,
//     whatsapp_number,
//     aadhaar_number,
//     student_subject,
//     approved,
//     approved_by,
//     country,
//     state,
//     district,
//     city,
//     level = 1,
//     level_status = "continue",
//     session_id,
//   } = req.body;

//   const userId = req.user?.id;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. Please log in." });
//   }

//   const newStudent = {
//     school_id,
//     student_name,
//     class_id,
//     student_section,
//     mobile_number,
//     whatsapp_number,
//     aadhaar_number,
//     student_subject,
//     approved,
//     approved_by,
//     country,
//     state,
//     district,
//     city,
//     level,
//     level_status,
//     session_id,
//   };

//   Student.create(newStudent, userId, (err, result) => {
//     if (err) {
//       return res.status(500).json({
//         message: err.message || "Insert failed",
//       });
//     }
//     res.status(201).json({
//       message: "Student Created Successfully.",
//       studentId: result?.insertId || null,
//     });
//   });
// };

export const createStudent = (req, res) => {
  const {
    school_id,
    student_name,
    class_id,
    student_section,
    mobile_number,
    whatsapp_number,
    aadhaar_number,
    student_subject,
    approved,
    approved_by,
    country,
    state,
    district,
    city,
    level = 1,
    level_status = "continue",
    session_id,
  } = req.body;

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const newStudent = {
    school_id,
    student_name,
    class_id,
    student_section,
    mobile_number,
    whatsapp_number,
    aadhaar_number,
    student_subject,
    approved,
    approved_by,
    country,
    state,
    district,
    city,
    level,
    level_status,
    session_id,
  };

  Student.create(newStudent, userId, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "Insert failed",
      });
    }

    // ✅ Log activity AFTER successful create
    logActivity({
      user_id: userId,
      user_name: req.user?.name || "system",
      activity: "Student has been Created",
      ip_address: req.ip || req.connection?.remoteAddress,
      data: {
        student_id: result?.insertId || null,
        student_name,
        school_id,
        class_id,
      },
    });

    res.status(201).json({
      message: "Student Created Successfully.",
      studentId: result?.insertId || null,
    });
  });
};

//buld controller

// export const bulkUploadStudents = async (req, res) => {
//   const students = req.body;
//   const userId = req.user?.id;

//   if (!Array.isArray(students) || students.length === 0) {
//     return res.status(400).json({
//       message: "No student data",
//       errors: [{ rowIndex: null, message: "No data provided" }],
//     });
//   }

//   if (!userId) {
//     return res.status(401).json({
//       message: "Unauthorized",
//       errors: [{ rowIndex: null, message: "Login required" }],
//     });
//   }

//   try {
//     const result = await Student.bulkCreate(students, userId);
//     return res.status(201).json({
//       message: "Students uploaded",
//       insertedCount: result.insertedCount,
//       errors: result.errors || [],
//     });
//   } catch (err) {
//     console.error("Bulk upload error:", err);

//     let errors = [];

//     // Handle known error types
//     if (err.cause && Array.isArray(err.cause)) {
//       errors = err.cause.map((e) => ({
//         rowIndex: e.rowIndex || null,
//         message: e.message,
//         type: e.message.includes("Aadhaar")
//           ? "duplicate_aadhaar"
//           : e.message.includes("Missing")
//           ? "missing_fields"
//           : "validation_error",
//       }));
//     } else {
//       errors = [{ rowIndex: null, message: err.message || "Unknown error" }];
//     }

//     return res.status(400).json({
//       message: "Upload failed",
//       errors,
//     });
//   }
// };

export const bulkUploadStudents = async (req, res) => {
  const students = req.body;
  const userId = req.user?.id;

  // Basic validation
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      message: "No student data provided",
      errors: [{ rowIndex: null, message: "Please upload student data" }],
    });
  }

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
      errors: [{ rowIndex: null, message: "Login required" }],
    });
  }

  try {
    const result = await Student.bulkCreate(students, userId);

    return res.status(201).json({
      message: "Students uploaded successfully",
      insertedCount: result.insertedCount,
      errors: result.errors || [], // empty array if no errors
    });

  } catch (err) {
    console.error("Bulk upload error:", err);

    let errors = [];

    // All structured errors come with err.cause = array of { rowIndex, message }
    if (err.cause && Array.isArray(err.cause)) {
      errors = err.cause.map((e) => ({
        rowIndex: e.rowIndex || null,
        message: e.message,
        type: (() => {
          if (e.message.includes("roll_no") || 
              e.message.includes("Roll No") || 
              e.message.includes("Duplicate roll_no")) {
            return "duplicate_roll_no";
          }
          if (e.message.includes("Aadhaar")) return "duplicate_aadhaar";
          if (e.message.includes("Missing")) return "missing_fields";
          if (e.message.includes("not found")) return "not_found";
          return "validation_error";
        })(),
      }));
    } else {
      // Fallback for unexpected errors
      errors = [{
        rowIndex: null,
        message: err.message || "Something went wrong during upload",
      }];
    }

    return res.status(400).json({
      message: "Upload failed",
      errors,
    });
  }
};

// Get all students
export const getAllstudentserach = (req, res) => {
  Student.getAllStudent((err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
};

//aadhaar number get stduent
export const getStudentByAadhaar = (req, res) => {
  const { aadhaar_number } = req.params;

  if (!aadhaar_number) {
    return res.status(400).json({ error: "Aadhaar number is required" });
  }

  Student.getByAadhaar(aadhaar_number, (err, results) => {
    if (err) {
      console.error("Error fetching student by Aadhaar:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No student found with this Aadhaar number" });
    }

    res.status(200).json({ student: results[0] }); // returning single student object
  });
};

//pagination and serch and get all data
// export const getAllStudents = (req, res) => {
//   let { page = 1, limit = 10, search = "" } = req.query;
//   page = parseInt(page);
//   limit = parseInt(limit);

//   Student.getAll(page, limit, search, (err, data) => {
//     if (err) return res.status(500).json({ error: err.message });

//     res.status(200).json(data);
//   });
// };

// export const getAllStudents = (req, res) => {
//   let { page = 1, limit = 10, search = "", session_id } = req.query;
//   page = parseInt(page);
//   limit = parseInt(limit);

//   if (!session_id) {
//     return res.status(400).json({ error: "session_id is required" });
//   }

//   Student.getAll(page, limit, search, session_id, (err, data) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(200).json({ session_id, ...data });
//   });
// };

export const getAllStudents = (req, res) => {
  let { page = 1, limit = 10, search = "", session_id = null } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  Student.getAll(page, limit, search, session_id, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ session_id: session_id || "active", ...data });
  });
};

// Get a single student by ID
export const getStudentById = (req, res) => {
  const { id } = req.params;
  Student.getById(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send("Student not found");
    res.status(200).send(result[0]);
  });
};

// export const updateStudent = (req, res) => {
//   const { id } = req.params;
//   const {
//     school_id,
//     student_name,
//     class_id,
//     student_section,
//     mobile_number,
//     whatsapp_number,
//     aadhaar_number,
//     student_subject,
//     approved,
//     approved_by,
//     country,
//     state,
//     district,
//     city,
//   } = req.body;

//   const updatedStudent = {
//     school_id,
//     student_name,
//     class_id,
//     student_section,
//     mobile_number,
//     whatsapp_number,
//     aadhaar_number,
//     student_subject: JSON.stringify(student_subject || []) || null,
//     approved,
//     approved_by,
//     country,
//     state,
//     district,
//     city,
//   };

//   Student.update(id, updatedStudent, (err, result) => {
//     if (err) return res.status(500).send(err);
//     if (result.affectedRows === 0)
//       return res.status(404).send({ message: "Student not found" });
//     res.status(200).send({ message: "Student updated successfully" });
//   });
// };

export const updateStudent = (req, res) => {
  const { id } = req.params;
  const {
    school_id,
    student_name,
    class_id,
    student_section,
    mobile_number,
    whatsapp_number,
    aadhaar_number,
    student_subject,
    approved,
    approved_by,
    country,
    state,
    district,
    city,
  } = req.body;

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const updatedStudent = {
    school_id,
    student_name,
    class_id,
    student_section,
    mobile_number,
    whatsapp_number,
    aadhaar_number,
    student_subject: JSON.stringify(student_subject || []) || null,
    approved,
    approved_by,
    country,
    state,
    district,
    city,
  };

  Student.update(id, updatedStudent, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Student not found" });

    // ✅ Log activity AFTER successful update
    logActivity({
      user_id: userId,
      user_name: req.user?.name || "system",
      activity: "Student has beed updated",
      ip_address: req.ip || req.connection?.remoteAddress,
      data: {
        student_id: id,
        updated_fields: updatedStudent,
      },
    });

    res.status(200).send({ message: "Student updated successfully" });
  });
};

// Delete a student by ID
// export const deleteStudent = (req, res) => {
//   const { id } = req.params;
//   Student.delete(id, (err, result) => {
//     if (err) return res.status(500).send(err);
//     if (result.affectedRows === 0)
//       return res.status(404).send("Student not found");
//     res.status(200).send({ message: "Student deleted" });
//   });
// };

export const deleteStudent = (req, res) => {
  const { id } = req.params;

  const userId = req.user?.id;
  const userName = req.user?.name || "Unknown User";

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  Student.delete(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0)
      return res.status(404).send({ message: "Student not found" });

    // ✅ log activity after successful delete
    logActivity({
      user_id: userId,
      user_name: userName,
      activity: `Student has been deleted`,
      ip_address: req.ip || req.connection?.remoteAddress,
      data: { studentId: id },
    });

    res.status(200).send({ message: "Student deleted successfully" });
  });
};

//omr issues
// export const getFilteredStudents = (req, res) => {
//   const { schoolName, classList, subjectList, level } = req.body;

//   // ✅ Validate input
//   if (!schoolName || !Array.isArray(classList) || !Array.isArray(subjectList)) {
//     return res.status(400).json({ error: "Invalid input data" });
//   }

//   // ✅ Call model method
//   Student.getStudentsByFilters(
//     schoolName,
//     classList,
//     subjectList,
//     level,
//     (err, result) => {
//       if (err) {
//         console.error("Error fetching students:", err);
//         return res.status(500).json({ error: "Failed to fetch students" });
//       }

//       const { students, totalCount, exam_date, center_name } = result;

//       // ✅ Fetch class names
//       Student.getClassNames(classList, (classErr, classNames) => {
//         if (classErr) {
//           console.error("Error fetching class names:", classErr);
//           return res.status(500).json({ error: "Failed to fetch class names" });
//         }

//         // ✅ Fetch subject names
//         Student.getSubjectNames(subjectList, (subjectErr, subjectNames) => {
//           if (subjectErr) {
//             console.error("Error fetching subject names:", subjectErr);
//             return res
//               .status(500)
//               .json({ error: "Failed to fetch subject names" });
//           }

//           // ✅ Return complete response
//           res.json({
//             students,
//             totalCount,
//             classNames,
//             subjectNames,
//             exam_date,
//             center_name, // 👈 New field added

//           });
//         });
//       });
//     }
//   );
// };

// ==============================
// export const getFilteredStudents = (req, res) => {
//   const { schoolName, classList, subjectList, level } = req.body;

//   // ✅ Validate input
//   if (!schoolName || !Array.isArray(classList) || !Array.isArray(subjectList)) {
//     return res.status(400).json({ error: "Invalid input data" });
//   }

//   // ✅ Call model method
//   Student.getStudentsByFilters(
//     schoolName,
//     classList,
//     subjectList,
//     level,
//     (err, result) => {
//       if (err) {
//         console.error("Error fetching students:", err);
//         return res.status(500).json({ error: "Failed to fetch students" });
//       }

//       const { students, totalCount, exam_date, center_name, school_level } =
//         result;

//       // ✅ Fetch class names
//       Student.getClassNames(classList, (classErr, classNames) => {
//         if (classErr) {
//           console.error("Error fetching class names:", classErr);
//           return res.status(500).json({ error: "Failed to fetch class names" });
//         }

//         // ✅ Fetch subject names
//         Student.getSubjectNames(subjectList, (subjectErr, subjectNames) => {
//           if (subjectErr) {
//             console.error("Error fetching subject names:", subjectErr);
//             return res
//               .status(500)
//               .json({ error: "Failed to fetch subject names" });
//           }

//           // ✅ Return complete response
//           res.json({
//             students,
//             totalCount,
//             classNames,
//             subjectNames,
//             exam_date,
//             center_name,
//             school_level, // 👈 now automatically shows ongoing level
//           });
//         });
//       });
//     }
//   );
// };

//===================================================
export const getFilteredStudents = (req, res) => {
  const { school_id, classList, subjectList, level } = req.body;

  // ✅ Validate input
  if (!school_id || !Array.isArray(classList) || !Array.isArray(subjectList)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  // ✅ Call model method
  Student.getStudentsByFilters(
    school_id,
    classList,
    subjectList,
    level,
    (err, result) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ error: "Failed to fetch students" });
      }

      const { students, totalCount, exam_date, center_name, school_level } =
        result;

      // ✅ Fetch class names
      Student.getClassNames(classList, (classErr, classNames) => {
        if (classErr) {
          console.error("Error fetching class names:", classErr);
          return res.status(500).json({ error: "Failed to fetch class names" });
        }

        // ✅ Fetch subject names
        Student.getSubjectNames(subjectList, (subjectErr, subjectNames) => {
          if (subjectErr) {
            console.error("Error fetching subject names:", subjectErr);
            return res
              .status(500)
              .json({ error: "Failed to fetch subject names" });
          }

          // ✅ Return complete response
          res.json({
            students,
            totalCount,
            classNames,
            subjectNames,
            exam_date,
            center_name,
            school_level,
          });
        });
      });
    }
  );
};

//omr receipt
// export const getFilteredStudentsomrreceipt = (req, res) => {
//   const { schoolName, classList, subjectList, rollnoclasssubject } = req.body;

//   if (!schoolName || !Array.isArray(classList) || !Array.isArray(subjectList)) {
//     return res.status(400).json({ error: "Invalid input data" });
//   }

//   Student.getStudents(
//     schoolName,
//     classList,
//     subjectList,
//     rollnoclasssubject,
//     (err, result) => {
//       if (err) {
//         console.error("Error fetching students:", err);
//         return res.status(500).json({ error: "Failed to fetch students" });
//       }

//       const { students, totalCount } = result;

//       Student.getClassNames(classList, (err, classNames) => {
//         if (err) {
//           console.error("Error fetching class names:", err);
//           return res.status(500).json({ error: "Failed to fetch class names" });
//         }

//         Student.getSubjectNames(subjectList, (err, subjectNames) => {
//           if (err) {
//             console.error("Error fetching subject names:", err);
//             return res
//               .status(500)
//               .json({ error: "Failed to fetch subject names" });
//           }

//           res.json({
//             students,
//             totalCount,
//             classNames,
//             subjectNames,
//           });
//         });
//       });
//     }
//   );
// };

export const getFilteredStudentsomrreceipt = (req, res) => {
  const { schoolId, classList, subjectList, rollnoclasssubject } = req.body;

  if (!schoolId || !Array.isArray(classList) || !Array.isArray(subjectList)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
    });
  }

  Student.getStudents(
    schoolId,
    classList,
    subjectList,
    rollnoclasssubject,
    (err, result) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch students",
          error: err.message,
        });
      }

      const {
        students,
        totalCount,
        successCount = 0,
        pendingCount = 0,
        message,
      } = result;

      Student.getClassNames(classList, (classErr, classNames) => {
        if (classErr) {
          console.error("Error fetching class names:", classErr);
          return res.status(500).json({
            success: false,
            message: "Failed to fetch class names",
          });
        }

        Student.getSubjectNames(subjectList, (subjectErr, subjectNames) => {
          if (subjectErr) {
            console.error("Error fetching subject names:", subjectErr);
            return res.status(500).json({
              success: false,
              message: "Failed to fetch subject names",
            });
          }

          return res.status(200).json({
            success: true,
            message: message || "Students fetched successfully",
            totalCount,
            successCount,   // ✅ added
            pendingCount,   // ✅ added
            students,
            classNames,
            subjectNames,
          });
        });
      });
    }
  );
};




//assign--omr
export const getFilteredStudentsbyassignomr = (req, res) => {
  const { schoolId, classList, subjectList } = req.body;

  if (!schoolId || !Array.isArray(classList) || !Array.isArray(subjectList)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
    });
  }

  Student.getStudentsforassignomr(schoolId, classList, subjectList, (err, result) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch students",
        error: err.message,
      });
    }

    const { students, totalCount, successCount = 0, pendingCount = 0 } = result;

    Student.getClassNames(classList, (classErr, classNames) => {
      if (classErr) {
        console.error("Error fetching class names:", classErr);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch class names",
        });
      }

      Student.getSubjectNames(subjectList, (subjectErr, subjectNames) => {
        if (subjectErr) {
          console.error("Error fetching subject names:", subjectErr);
          return res.status(500).json({
            success: false,
            message: "Failed to fetch subject names",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Students fetched successfully",
          totalCount,
          successCount,
          pendingCount,
          students,
          classNames,
          subjectNames,
        });
      });
    });
  });
};





//A Student Attendance
// export const getFilteredStudentsforattendance = (req, res) => {
//   const { schoolId, classList, subjectList } = req.body;

//   // Validate input
//   if (!schoolId || !Array.isArray(classList) || !Array.isArray(subjectList)) {
//     return res.status(400).json({ error: "Invalid input data" });
//   }

//   Student.getStudentforAttendance(
//     schoolId,
//     classList,
//     subjectList,
//     (err, result) => {
//       if (err) {
//         console.error("Error fetching students:", err);
//         return res.status(500).json({ error: "Failed to fetch students" });
//       }

//       const { students, totalCount, exam_date } = result;

//       // Get class names
//       Student.getClassNames(classList, (classErr, classNames) => {
//         if (classErr) {
//           console.error("Error fetching class names:", classErr);
//           return res.status(500).json({ error: "Failed to fetch class names" });
//         }

//         // Get subject names
//         Student.getSubjectNames(subjectList, (subErr, subjectNames) => {
//           if (subErr) {
//             console.error("Error fetching subject names:", subErr);
//             return res
//               .status(500)
//               .json({ error: "Failed to fetch subject names" });
//           }

//           // Final response
//           return res.status(200).json({
//             students, // One row per subject
//             totalCount, // Unique student count
//             classNames,
//             subjectNames,
//             exam_date, // Latest exam date
//           });
//         });
//       });
//     }
//   );
// };
export const getFilteredStudentsforattendance = (req, res) => {
  const { schoolId, classList, subjectList } = req.body;

  if (!schoolId || !Array.isArray(classList) || !Array.isArray(subjectList)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  Student.getStudentforAttendance(
    schoolId,
    classList,
    subjectList,
    (err, result) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ error: "Failed to fetch students" });
      }

      const { students, totalCount, exam_dates } = result;

      Student.getClassNames(classList, (classErr, classNames) => {
        if (classErr)
          return res.status(500).json({ error: "Failed to fetch class names" });

        Student.getSubjectNames(subjectList, (subErr, subjectNames) => {
          if (subErr)
            return res
              .status(500)
              .json({ error: "Failed to fetch subject names" });

          return res.status(200).json({
            students,
            totalCount,
            classNames,
            subjectNames,
            exam_dates, // array of {class_id,subject_id,exam_id,exam_date}
          });
        });
      });
    }
  );
};

// student report
// export const getFilteredStudentsforReport = (req, res) => {
//   const { schoolId, classList, subjectList } = req.body;

//   // Validate input
//   if (!schoolId || !Array.isArray(classList) || !Array.isArray(subjectList)) {
//     return res.status(400).json({ error: "Invalid input data" });
//   }

//   // Step 1: Get students based on filters
//   Student.getStudentforReport(
//     schoolId,
//     classList,
//     subjectList,
//     (err, result) => {
//       if (err) {
//         console.error("Error fetching students:", err);
//         return res.status(500).json({ error: "Failed to fetch students" });
//       }

//       const { students, totalCount } = result;

//       // Step 2: Get class names
//       Student.getClassNames(classList, (classErr, classNames) => {
//         if (classErr) {
//           console.error("Error fetching class names:", classErr);
//           return res.status(500).json({ error: "Failed to fetch class names" });
//         }

//         // Step 3: Get subject names
//         Student.getSubjectNames(subjectList, (subErr, subjectNames) => {
//           if (subErr) {
//             console.error("Error fetching subject names:", subErr);
//             return res
//               .status(500)
//               .json({ error: "Failed to fetch subject names" });
//           }

//           // Final response
//           return res.status(200).json({
//             students,
//             totalCount,
//             classNames,
//             subjectNames,
//           });
//         });
//       });
//     }
//   );
// };

export const getFilteredStudentsforReport = (req, res) => {
  const { schoolId, classList, subjectList, session_id } = req.body;

  // Validate input
  if (!schoolId || !Array.isArray(classList) || !Array.isArray(subjectList)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  // Step 1: Get students based on filters (with session_id)
  Student.getStudentforReport(
    schoolId,
    classList,
    subjectList,
    session_id,
    (err, result) => {
      if (err) {
        console.error("Error fetching students:", err.message || err);
        return res
          .status(500)
          .json({ error: err.message || "Failed to fetch students" });
      }

      const { students, totalCount } = result;

      // Step 2: Get class names
      Student.getClassNames(classList, (classErr, classNames) => {
        if (classErr) {
          console.error(
            "Error fetching class names:",
            classErr.message || classErr
          );
          return res.status(500).json({ error: "Failed to fetch class names" });
        }

        // Step 3: Get subject names
        Student.getSubjectNames(subjectList, (subErr, subjectNames) => {
          if (subErr) {
            console.error(
              "Error fetching subject names:",
              subErr.message || subErr
            );
            return res
              .status(500)
              .json({ error: "Failed to fetch subject names" });
          }

          // Final response
          return res.status(200).json({
            students,
            totalCount,
            classNames,
            subjectNames,
          });
        });
      });
    }
  );
};
