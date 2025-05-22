import Student from "../../models/Student/studentModel.js";


// Create a single student
// export const createStudent = (req, res) => {
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

//   // Extract logged-in user ID from request
//   const userId = req.user?.id;

//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. Please log in." });
//   }

//   const newStudent = {
//     school_name,
//     student_name,
//     class_name,
//     student_section,
//     mobile_number,
//     whatsapp_number,
//     student_subject,
//     approved,
//     approved_by,
//   };

//   Student.create(newStudent, userId, (err, result) => {
//     if (err) return res.status(500).send(err);
//     res
//       .status(201)
//       .send({ message: "Student created", studentId: result.insertId });
//   });
// };

export const createStudent = (req, res) => {
  const {
    school_name,
    student_name,
    class_name,
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

  // Extract logged-in user ID from request
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const newStudent = {
    school_name,
    student_name,
    class_name,
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
  };

  Student.create(newStudent, userId, (err, result) => {
    if (err) return res.status(500).send(err);
    res
      .status(201)
      .send({ message: "Student created", studentId: result.insertId });
  });
};

// Bulk upload students

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
//     res.status(500).json({
//       message: "Error uploading students",
//       error: err.message,
//       errors: err.cause,
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
      errors: err.cause, // Include detailed errors (e.g., inconsistencies)
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

export const getAllStudents = (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  Student.getAll(page, limit, (err, data) => {
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
    school_name,
    student_name,
    class_name,
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
    school_name,
    student_name,
    class_name,
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

      const { students, totalCount } = result; // ✅ fixed here

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
            totalCount, // ✅ make sure it's correct here too
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


