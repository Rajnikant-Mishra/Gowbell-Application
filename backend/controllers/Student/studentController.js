import Student from "../../models/Student/studentModel.js";

// Create a single student
// export const createStudent = (req, res) => {
//   const {
//     school_id,
//     student_name,
//     class_id,
//     student_section,
//     mobile_number,
//     whatsapp_number,
//     student_subject,
//     approved,
//     approved_by,
//     country,
//     state,
//     district,
//     city,
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
//     student_subject,
//     approved,
//     approved_by,
//     country,
//     state,
//     district,
//     city,
//   };

//   console.log("Received student data:", newStudent);

//   Student.create(newStudent, userId, (err, result) => {
//     if (err) {
//       console.error("Insert error:", err);
//       return res.status(500).json({ message: "Insert failed", error: err });
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
    student_subject,
    approved,
    approved_by,
    country,
    state,
    district,
    city,
    level = 1, // default
    level_status = "continue", //default
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
    student_subject,
    approved,
    approved_by,
    country,
    state,
    district,
    city,
    level,
    level_status,
  };

  console.log("Received student data:", newStudent);

  Student.create(newStudent, userId, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res
        .status(500)
        .json({ message: "Insert failed", error: err.message });
    }

    console.log("Insert success:", result);
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

export const bulkUploadStudents = async (req, res) => {
  const students = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "No student data provided" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const result = await Student.bulkCreate(students, userId);
    res.status(201).json({
      message: "Students uploaded successfully",
      insertedCount: result.affectedRows,
      errors: result.errors,
    });
  } catch (err) {
    console.error("Error inserting students:", err);
    res.status(400).json({
      message: "Error uploading students",
      error: err.message,
      errors: err.cause,
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

//pagination and serch and get all data
export const getAllStudents = (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  Student.getAll(page, limit, search, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(data);
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

//       const { students, totalCount } = result; // ✅ fixed here

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
//             totalCount, // ✅ make sure it's correct here too
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
            students, // ✅ multiple rows per student per subject
            totalCount, // ✅ distinct student count
            classNames,
            subjectNames,
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

//attendance
// export const getFilteredStudentsforattendance = (req, res) => {
//   const { schoolName, classList, subjectList } = req.body;

//   if (!schoolName || !Array.isArray(classList) || !Array.isArray(subjectList)) {
//     return res.status(400).json({ error: "Invalid input data" });
//   }

//   Student.getStudentforAttendance(
//     schoolName,
//     classList,
//     subjectList,
//     (err, result) => {
//       if (err) {
//         console.error("Error fetching students:", err);
//         return res.status(500).json({ error: "Failed to fetch students" });
//       }

//       const { students, totalCount } = result;

//       Student.getClassNames(classList, (classErr, classNames) => {
//         if (classErr) {
//           console.error("Error fetching class names:", classErr);
//           return res.status(500).json({ error: "Failed to fetch class names" });
//         }

//         Student.getSubjectNames(subjectList, (subErr, subjectNames) => {
//           if (subErr) {
//             console.error("Error fetching subject names:", subErr);
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
export const getFilteredStudentsforattendance = (req, res) => {
  const { schoolId, classList, subjectList } = req.body;

  // Validate input
  if (!schoolId || !Array.isArray(classList) || !Array.isArray(subjectList)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  // Step 1: Get students based on filters
  Student.getStudentforAttendance(
    schoolId,
    classList,
    subjectList,
    (err, result) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ error: "Failed to fetch students" });
      }

      const { students, totalCount } = result;

      // Step 2: Get class names
      Student.getClassNames(classList, (classErr, classNames) => {
        if (classErr) {
          console.error("Error fetching class names:", classErr);
          return res.status(500).json({ error: "Failed to fetch class names" });
        }

        // Step 3: Get subject names
        Student.getSubjectNames(subjectList, (subErr, subjectNames) => {
          if (subErr) {
            console.error("Error fetching subject names:", subErr);
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
