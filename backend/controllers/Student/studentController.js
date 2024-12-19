import  Student from '../../models/Student/studentModel.js';

// Create a new student
// export const createStudent = (req, res) => {
//     const { school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by } = req.body;
//     const newStudent = { school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by };
  
//     Student.create(newStudent, (err, result) => {
//       if (err) return res.status(500).send(err);
//       res.status(201).send({ message: 'Student is created', studentId: result.insertId });
//     });
//   };

export const createStudent = (req, res) => {
  const { school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by } = req.body;

  // Generate a student code (this could be a more complex generation logic)
  const student_code = `${school_name.slice(0, 3).toUpperCase()}-${Date.now()}`;

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
    student_code // Add the student code to the new student object
  };

  Student.create(newStudent, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Student is created', studentId: result.insertId, studentCode: student_code });
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
      if (result.length === 0) return res.status(404).send('Student not found');
      res.status(200).send(result[0]);
    });
  };
  
  // Update a student by ID
  export const updateStudent = (req, res) => {
    const { id } = req.params;
    const { school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by } = req.body;
    const updatedStudent = { school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by };
  
    Student.update(id, updatedStudent, (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) return res.status(404).send('Student not found');
      res.status(200).send({ message: 'Student updated' });
    });
  };
  
  // Delete a student by ID
  export const deleteStudent = (req, res) => {
    const { id } = req.params;
    Student.delete(id, (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) return res.status(404).send('Student not found');
      res.status(200).send({ message: 'Student deleted' });
    });
  };


  // Get students by class and school
export const getStudentsByClassController = (req, res) => {
  const { school_name, class_from, class_to } = req.body;

  Student.getStudentsByClass(school_name, class_from, class_to, (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).json(result);
  });
};