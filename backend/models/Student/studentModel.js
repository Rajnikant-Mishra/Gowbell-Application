import { db } from '../../config/db.js';

export const Student = {
    
    create: (studentData, callback) => {
      const { school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by } = studentData;
      const query = 'INSERT INTO student (school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
      db.query(query, [school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by], callback);
    },
  
    getAll: (callback) => {
      const query = 'SELECT * FROM student';
      db.query(query, callback);
    },
  
    getById: (id, callback) => {
      const query = 'SELECT * FROM student WHERE id = ?';
      db.query(query, [id], callback);
    },
  
    update: (id, studentData, callback) => {
      const { school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by } = studentData;
      const query = 'UPDATE student SET school_name = ?, student_name = ?, class_name = ?, student_section = ?, mobile_number = ?, whatsapp_number = ?, student_subject = ?, approved = ?, approved_by = ?, updated_at = NOW() WHERE id = ?';
      db.query(query, [school_name, student_name, class_name, student_section, mobile_number, whatsapp_number, student_subject, approved, approved_by, id], callback);
    },
  
    delete: (id, callback) => {
      const query = 'DELETE FROM student WHERE id = ?';
      db.query(query, [id], callback);
    },

    getStudentsByClass: (school_name, class_from, class_to, callback) => {
      const query = `
          SELECT * FROM student
          WHERE school_name = ? AND class_name BETWEEN ? AND ?;
      `;
      db.query(query, [school_name, class_from, class_to], callback);
  }


    
  };
  

export default Student;
