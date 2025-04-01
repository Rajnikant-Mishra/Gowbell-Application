import ExamParent from "../../models/Exam/Exam_parentModel.js";
import ExamChild from "../../models/Exam/Exam_childModel.js";

/** Create Exam (Parent + Child) */
export const createExam = (req, res) => {
  const { exam_code, school, class_name, subject, level, exam_date, students } =
    req.body;

  // Step 1: Extract the logged-in user ID from the request
  const userId = req.user?.id; // Ensure authentication middleware adds `userId`

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  // Step 2: Insert into `exam_parent` and store `created_by`
  ExamParent.create(
    {
      exam_code,
      school,
      class_name,
      subject,
      level,
      exam_date,
      created_by: userId,
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create exam", err });
      }

      const exam_id = result.insertId; // ✅ Get the generated exam_id

      // Step 3: Prepare student data with the correct `exam_id`
      const studentData = students.map((student) => ({
        exam_id, // ✅ Ensure exam_id is set
        student_name: student.student_name,
        roll_number: student.roll_number,
        class: student.class,
        full_mark: student.full_mark,
        subject: student.subject,
      }));

      // Step 4: Insert students into `exam_child`
      ExamChild.createMany(studentData, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to add students", err });
        }
        res
          .status(201)
          .json({ message: "Exam and students created successfully" });
      });
    }
  );
};

/** Get All Exams with Student Data */
export const getExams = (req, res) => {
  ExamParent.getAll((err, exams) => {
    if (err)
      return res.status(500).json({ error: "Failed to fetch exams", err });

    const examPromises = exams.map((exam) => {
      return new Promise((resolve) => {
        ExamChild.getByExamCode(exam.exam_code, (err, students) => {
          if (err) resolve({ ...exam, students: [] });
          else resolve({ ...exam, students });
        });
      });
    });

    Promise.all(examPromises).then((examList) =>
      res.status(200).json(examList)
    );
  });
};

/** Update Exam */
export const updateExam = (req, res) => {
  const { exam_code } = req.params;
  const { school, class_name, subject, level, exam_date, students } = req.body;

  ExamParent.update(
    exam_code,
    { school, class_name, subject, level, exam_date },
    (err) => {
      if (err)
        return res.status(500).json({ error: "Failed to update exam", err });

      ExamChild.deleteByExamCode(exam_code, (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Failed to remove old students", err });

        ExamChild.createMany(students, (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Failed to update students", err });
          res.status(200).json({ message: "Exam updated successfully" });
        });
      });
    }
  );
};

/**  Delete Exam */
export const deleteExam = (req, res) => {
  const { id } = req.params;

  ExamParent.delete(id, (err) => {
    if (err)
      return res.status(500).json({ error: "Failed to delete exam", err });
    res.status(200).json({ message: "Exam deleted successfully" });
  });
};

export const getExamsWithStudents = (req, res) => {
  ExamParent.getAllWithStudents((err, results) => {
    if (err) {    
      return res.status(500).json({ error: "Failed to fetch exams with students", err });
    }

    // Group results by exam_parent
    const examsMap = new Map();

    results.forEach((row) => {
      const examId = row.exam_id;

      // If the exam is not in the map, add it
      if (!examsMap.has(examId)) {
        examsMap.set(examId, {
          id: row.exam_id,
          created_by: row.created_by,
          exam_code: row.exam_code,
          school: row.school,
          class: row.class_name,
          subject: row.subject,
          level: row.level,
          exam_date: row.exam_date,
          created_at: row.created_at,
          updated_at: row.updated_at,
          student_count: 0, // Initialize student_count
          students: [],
        });
      }

      // If there is a student record, add it to the students array
      if (row.student_id) {
        examsMap.get(examId).students.push({
          id: row.student_id,
          exam_id: row.exam_id,
          student_name: row.student_name,
          roll_number: row.roll_number,
          class: row.student_class,
          full_mark: row.full_mark,
          subject: row.student_subject,
        });

        // Increment the student_count
        examsMap.get(examId).student_count += 1;
      }
    });

    // Convert the map to an array of exams
    const exams = Array.from(examsMap.values());

    res.status(200).json(exams);
  });
};
