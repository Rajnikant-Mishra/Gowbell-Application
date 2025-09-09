import Student from "../../models/Student/studentModel.js";

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
//     level = 1, // default
//     level_status = "continue", // default
//     session_id, // <-- add this
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
//     session_id, // <-- include here
//   };

//   console.log("Received student data:", newStudent);

//   Student.create(newStudent, userId, (err, result) => {
//     if (err) {
//       console.error("Insert error full details:", err);
//       return res.status(500).json({
//         message: "Insert failed",
//         error: err.message,
//       });
//     }

//     console.log("Insert success:", result);
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
    res.status(201).json({
      message: "Student Created Successfully.",
      studentId: result?.insertId || null,
    });
  });
};

// export const bulkUploadStudents = async (req, res) => {
//   const students = req.body;

//   if (!Array.isArray(students) || students.length === 0) {
//     return res.status(400).json({ message: "No student data provided" });
//   }

//   const userId = req.user?.id;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. Please log in." });
//   }

//   try {
//     const result = await Student.bulkCreate(students, userId);
//     res.status(201).json({
//       message: "Students uploaded successfully",
//       insertedCount: result.affectedRows,
//       errors: result.errors,
//     });
//   } catch (err) {
//     console.error("Error inserting students:", err);
//     res.status(400).json({
//       message: "Error uploading students",
//       error: err.message,
//       errors: err.cause, // Include detailed errors (e.g., inconsistencies)
//     });
//   }
// };

// export const bulkUploadStudents = async (req, res) => {
//   const students = req.body;

//   if (!Array.isArray(students) || students.length === 0) {
//     return res.status(400).json({ message: "No student data provided" });
//   }

//   const userId = req.user?.id;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. Please log in." });
//   }

//   try {
//     const result = await Student.bulkCreate(students, userId);
//     res.status(201).json({
//       message: "Students uploaded successfully",
//       insertedCount: result.affectedRows,
//       errors: result.errors,
//     });
//   } catch (err) {
//     console.error("Error inserting students:", err);
//     res.status(400).json({
//       message: "Error uploading students",
//       error: err.message,
//       errors: err.cause,
//     });
//   }
// };

// export const bulkUploadStudents = async (req, res) => {
//   const students = req.body;

//   if (!Array.isArray(students) || students.length === 0) {
//     return res.status(400).json({ message: "No student data provided" });
//   }

//   const userId = req.user?.id;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. Please log in." });
//   }

//   try {
//     const result = await Student.bulkCreate(students, userId);

//     return res.status(201).json({
//       message: "Students uploaded successfully",
//       insertedCount: result.insertedCount, // ✅ Correct property
//       errors: result.errors || [], // ✅ Always return an array for consistency
//     });
//   } catch (err) {
//     console.error("Error inserting students:", err);

//     return res.status(400).json({
//       message: "Error uploading students",
//       error: err.message,
//       errors: Array.isArray(err.cause) ? err.cause : [err.message], // ✅ Ensure array format
//     });
//   }
// };

export const bulkUploadStudents = async (req, res) => {
  const students = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      message: "No student data provided",
      errors: ["No student data provided"],
    });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized. Please log in.",
      errors: ["Unauthorized access"],
    });
  }

  try {
    const result = await Student.bulkCreate(students, userId);

    return res.status(201).json({
      message: "Students uploaded successfully",
      insertedCount: result.insertedCount,
      errors: result.errors || [], // Array of error objects
    });
  } catch (err) {
    console.error("Error inserting students:", err);

    // Format errors consistently as an array of objects
    let formattedErrors = [];
    if (err.cause) {
      if (err.message === "Duplicate Aadhaar numbers found") {
        formattedErrors = err.cause.map((aadhaar) => ({
          message: `Duplicate Aadhaar number: ${aadhaar}`,
          type: "duplicate_aadhaar",
        }));
      } else if (err.message === "Missing required fields") {
        formattedErrors = err.cause.map((errorMsg) => ({
          message: errorMsg,
          type: "missing_fields",
        }));
      } else if (err.message === "All student records failed validation") {
        formattedErrors = err.cause.map((error) => ({
          message: `Student ${error.student}: ${error.error}`,
          type: "validation_error",
        }));
      } else {
        formattedErrors = [{ message: err.message, type: "general_error" }];
      }
    } else {
      formattedErrors = [{ message: err.message, type: "general_error" }];
    }

    return res.status(400).json({
      message: "Error uploading students",
      error: err.message,
      errors: formattedErrors,
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
      return res.status(404).json({ message: "No student found with this Aadhaar number" });
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

// Update a student by ID
// export const updateStudent = (req, res) => {
//   const { id } = req.params;
//   const {
//     school_name,
//     student_name,
//     class_name,
//     student_section,
//     mobile_number,
//     whatsapp_number,
//     student_subject,
//     approved,
//     approved_by,
//   } = req.body;

//   const updatedStudent = {
//     school_name,
//     student_name,
//     class_name,
//     student_section,
//     mobile_number,
//     whatsapp_number,
//     student_subject: JSON.stringify(student_subject || []) || null,
//     approved,
//     approved_by,
//   };

//   Student.update(id, updatedStudent, (err, result) => {
//     if (err) return res.status(500).send(err);
//     if (result.affectedRows === 0)
//       return res.status(404).send("Student not found");
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
    res.status(200).send({ message: "Student updated successfully" });
  });
};

// Delete a student by ID
export const deleteStudent = (req, res) => {
  const { id } = req.params;
  Student.delete(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0)
      return res.status(404).send("Student not found");
    res.status(200).send({ message: "Student deleted" });
  });
};

//omr issues
// export const getFilteredStudents = (req, res) => {
//   const { schoolName, classList, subjectList } = req.body;

//   if (!schoolName || !Array.isArray(classList) || !Array.isArray(subjectList)) {
//     return res.status(400).json({ error: "Invalid input data" });
//   }

//   Student.getStudentsByFilters(
//     schoolName,
//     classList,
//     subjectList,
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
//             students, // ✅ multiple rows per student per subject
//             totalCount, // ✅ distinct student count
//             classNames,
//             subjectNames,
//           });
//         });
//       });
//     }
//   );
// };
export const getFilteredStudents = (req, res) => {
  const { schoolName, classList, subjectList } = req.body;

  if (!schoolName || !Array.isArray(classList) || !Array.isArray(subjectList)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  Student.getStudentsByFilters(
    schoolName,
    classList,
    subjectList,
    (err, result) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ error: "Failed to fetch students" });
      }

      const { students, totalCount, exam_date } = result;

      Student.getClassNames(classList, (err, classNames) => {
        if (err) {
          console.error("Error fetching class names:", err);
          return res.status(500).json({ error: "Failed to fetch class names" });
        }

        Student.getSubjectNames(subjectList, (err, subjectNames) => {
          if (err) {
            console.error("Error fetching subject names:", err);
            return res
              .status(500)
              .json({ error: "Failed to fetch subject names" });
          }

          res.json({
            students, // multiple rows per student per subject
            totalCount, // distinct student count
            classNames,
            subjectNames,
            exam_date, // new field added
          });
        });
      });
    }
  );
};

//omr receipt
export const getFilteredStudentsomrreceipt = (req, res) => {
  const { schoolName, classList, subjectList, rollnoclasssubject } = req.body;

  if (!schoolName || !Array.isArray(classList) || !Array.isArray(subjectList)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  Student.getStudents(
    schoolName,
    classList,
    subjectList,
    rollnoclasssubject,
    (err, result) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ error: "Failed to fetch students" });
      }

      const { students, totalCount } = result;

      Student.getClassNames(classList, (err, classNames) => {
        if (err) {
          console.error("Error fetching class names:", err);
          return res.status(500).json({ error: "Failed to fetch class names" });
        }

        Student.getSubjectNames(subjectList, (err, subjectNames) => {
          if (err) {
            console.error("Error fetching subject names:", err);
            return res
              .status(500)
              .json({ error: "Failed to fetch subject names" });
          }

          res.json({
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
