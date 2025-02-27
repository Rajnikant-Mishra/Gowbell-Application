import Student from "../../models/Student/studentModel.js";

// Create a single student
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
  };

  Student.create(newStudent, userId, (err, result) => {
    if (err) return res.status(500).send(err);
    res
      .status(201)
      .send({ message: "Student created", studentId: result.insertId });
  });
};

// Bulk upload students
export const bulkUploadStudents = (req, res) => {
  const students = req.body; // Expecting an array of student objects

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).send({ message: "No student data provided" });
  }

  // Prepare data without student_code
  const studentData = students.map(({ student_code, ...student }) => student);

  // Call bulkCreate method from the model
  Student.bulkCreate(studentData, (err, result) => {
    if (err) {
      console.error("Error inserting students:", err);
      return res
        .status(500)
        .send({ message: "Error uploading students", error: err });
    }
    res.status(201).send({
      message: "Students uploaded successfully",
      insertedCount: result.affectedRows,
    });
  });
};

// Get all students
export const getAllStudents = (req, res) => {
  Student.getAll((err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
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
  };

  Student.update(id, updatedStudent, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0)
      return res.status(404).send("Student not found");
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

// Get students by class and school
export const getStudentsByClassController = (req, res) => {
  const { school_name, class_from, class_to } = req.body;

  Student.getStudentsByClass(
    school_name,
    class_from,
    class_to,
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).json(result);
    }
  );
};


// Fetch classes by school
export const getClassesBySchool = (req, res) => {
  const { school_name } = req.query;

  if (!school_name) {
    return res.status(400).json({ error: "School name is required" });
  }

  Student.getClassesBySchool(school_name, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Fetch subjects by class and school
export const getSubjectsByClassAndSchool = (req, res) => {
  const { school_name, class_name } = req.query;

  if (!school_name || !class_name) {
    return res.status(400).json({ error: "School name and class name are required" });
  }

  Student.getSubjectsByClassAndSchool(school_name, class_name, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};


export const getStudentsBySubjectClassAndSchool = (req, res) => {
  const { school_name, class_name, student_subject } = req.query;

  if (!school_name || !class_name || !student_subject) {
    return res.status(400).json({ error: "School name, class name, and subject are required" });
  }

  Student.getStudentsBySubjectClassAndSchool(school_name, class_name, student_subject, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};
