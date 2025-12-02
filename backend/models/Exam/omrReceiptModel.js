// models/Exam/omrReceiptModel.js
import { db } from "../../config/db.js";

const OmrReceipt = {
  bulkUpload: (rows, callback) => {
    const errors = [];
    const validRows = [];
    let i = 0;

    const processRow = () => {
      if (i >= rows.length) {
        // All rows processed → insert valid rows
        if (validRows.length > 0) {
          const insertQuery = `
            INSERT INTO omr_receipt (
              school_id, class_id, subject_id, roll_no, student_id,
              mobile_number, student_section, status, created_at
            ) VALUES ?
          `;
          db.query(
            insertQuery,
            [
              validRows.map((r) => [
                r.school_id,
                r.class_id,
                r.subject_id,
                r.roll_no,
                r.student_id,
                r.mobile_number,
                r.student_section,
                "Success",
                new Date(),
              ]),
            ],
            (err, result) => {
              if (err) return callback(err);
              return callback(null, { inserted: validRows.length, errors });
            }
          );
        } else {
          return callback(null, { inserted: 0, errors });
        }
        return;
      }

      const row = rows[i];
      const { school, class: className, subject, name, roll_no } = row;

      // 1️⃣ Get school_id
      db.query(
        "SELECT id FROM school WHERE school_name = ? LIMIT 1",
        [school],
        (err, schoolData) => {
          if (err) return callback(err);
          if (schoolData.length === 0) {
            errors.push({ row: i + 1, message: `School not found: ${school}` });
            i++;
            return processRow();
          }
          const school_id = schoolData[0].id;

          // 2️⃣ Get class_id
          db.query(
            "SELECT id FROM class WHERE name = ? LIMIT 1",
            [className, school_id],
            (err, classData) => {
              if (err) return callback(err);
              if (classData.length === 0) {
                errors.push({
                  row: i + 1,
                  message: `Class not found: ${className} in ${school}`,
                });
                i++;
                return processRow();
              }
              const class_id = classData[0].id;

              // 3️⃣ Get subject_id
              db.query(
                "SELECT id FROM subject_master WHERE name = ? LIMIT 1",
                [subject],
                (err, subjectData) => {
                  if (err) return callback(err);
                  if (subjectData.length === 0) {
                    errors.push({
                      row: i + 1,
                      message: `Subject not found! Please check this subject ${subject}`,
                    });
                    i++;
                    return processRow();
                  }
                  const subject_id = subjectData[0].id;

                  // 4️⃣ Get student_id and validate each field separately
                  db.query(
                    `SELECT id, mobile_number, student_section AS section, roll_no, student_name, class_id, school_id 
                     FROM student
                     WHERE student_name = ? AND roll_no = ? AND class_id = ? AND school_id = ? LIMIT 1`,
                    [name, roll_no, class_id, school_id],
                    (err, studentData) => {
                      if (err) return callback(err);

                      if (studentData.length === 0) {
                        // Check individually for better recognition
                        db.query(
                          "SELECT id FROM student WHERE student_name = ? LIMIT 1",
                          [name],
                          (err, nameData) => {
                            if (err) return callback(err);
                            if (nameData.length === 0) {
                              errors.push({
                                row: i + 1,
                                message: `${name} Student name not found in this school ${school} `,
                              });
                            }
                            db.query(
                              "SELECT id FROM student WHERE roll_no = ? LIMIT 1",
                              [roll_no],
                              (err, rollData) => {
                                if (err) return callback(err);
                                if (rollData.length === 0) {
                                  errors.push({
                                    row: i + 1,
                                    message: `This Roll number not found! Please check this roll no ${roll_no}`,
                                  });
                                }
                                db.query(
                                  "SELECT id FROM student WHERE class_id = ? LIMIT 1",
                                  [class_id],
                                  (err, classCheck) => {
                                    if (err) return callback(err);
                                    if (classCheck.length === 0) {
                                      errors.push({
                                        row: i + 1,
                                        message: `No student found in class_id: ${class_id}`,
                                      });
                                    }
                                    db.query(
                                      "SELECT id FROM student WHERE school_id = ? LIMIT 1",
                                      [school_id],
                                      (err, schoolCheck) => {
                                        if (err) return callback(err);
                                        if (schoolCheck.length === 0) {
                                          errors.push({
                                            row: i + 1,
                                            message: `No student found in school_id: ${school_id}`,
                                          });
                                        }
                                        i++;
                                        processRow();
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      } else {
                        const s = studentData[0];

                        // 5️⃣ Check duplicate roll_no in omr_receipt
                        db.query(
                          `SELECT id FROM omr_receipt WHERE roll_no = ? AND student_id = ? LIMIT 1`,
                          [roll_no, s.id],
                          (err, duplicateData) => {
                            if (err) return callback(err);

                            if (duplicateData.length > 0) {
                              errors.push({
                                row: i + 1,
                                message: `Duplicate entry: Roll ${roll_no} already exists for student ${name}`,
                              });
                            } else {
                              validRows.push({
                                school_id,
                                class_id,
                                subject_id,
                                roll_no,
                                student_id: s.id,
                                mobile_number: s.mobile_number,
                                student_section: s.section,
                              });
                            }

                            i++;
                            processRow(); // next row
                          }
                        );
                      }
                    }
                  );
                }
              );
            }
          );
        }
      );
    };

    processRow(); // start processing
  },
};

export default OmrReceipt;
