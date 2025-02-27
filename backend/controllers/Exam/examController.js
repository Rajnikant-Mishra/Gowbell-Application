import ExamParent from "../../models/Exam/Exam_parentModel.js";
import ExamChild from "../../models/Exam/Exam_childModel.js";

/** ✅ Create Exam (Parent + Child) */
export const createExam = (req, res) => {
  const { exam_code, school, class_name, subject, level, exam_date, students } = req.body;

  // Step 1: Insert into exam_parent and get `exam_id`
  ExamParent.create({ exam_code, school, class_name, subject, level, exam_date }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create exam", err });
    }

    const exam_id = result.insertId; // ✅ Get the generated exam_id

    // Step 2: Prepare student data with the correct `exam_id`
    const studentData = students.map((student) => ({
      exam_id, // ✅ Ensure exam_id is set
      student_name: student.student_name,
      roll_number: student.roll_number,
      class: student.class,
      full_mark: student.full_mark,
      subject: student.subject,
    }));

    // Step 3: Insert students into exam_child
    ExamChild.createMany(studentData, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to add students", err });
      }
      res.status(201).json({ message: "Exam and students created successfully" });
    });
  });
};

/** ✅ Get All Exams with Student Data */
export const getExams = (req, res) => {
  ExamParent.getAll((err, exams) => {
    if (err) return res.status(500).json({ error: "Failed to fetch exams", err });

    const examPromises = exams.map((exam) => {
      return new Promise((resolve) => {
        ExamChild.getByExamCode(exam.exam_code, (err, students) => {
          if (err) resolve({ ...exam, students: [] });
          else resolve({ ...exam, students });
        });
      });
    });

    Promise.all(examPromises).then((examList) => res.status(200).json(examList));
  });
};

/** ✅ Update Exam */
export const updateExam = (req, res) => {
  const { exam_code } = req.params;
  const { school, class_name, subject, level, exam_date, students } = req.body;

  ExamParent.update(exam_code, { school, class_name, subject, level, exam_date }, (err) => {
    if (err) return res.status(500).json({ error: "Failed to update exam", err });

    ExamChild.deleteByExamCode(exam_code, (err) => {
      if (err) return res.status(500).json({ error: "Failed to remove old students", err });

      ExamChild.createMany(students, (err) => {
        if (err) return res.status(500).json({ error: "Failed to update students", err });
        res.status(200).json({ message: "Exam updated successfully" });
      });
    });
  });
};

/** ✅ Delete Exam */
export const deleteExam = (req, res) => {
  const { id } = req.params;

  ExamParent.delete(id, (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete exam", err });
    res.status(200).json({ message: "Exam deleted successfully" });
  });
};
