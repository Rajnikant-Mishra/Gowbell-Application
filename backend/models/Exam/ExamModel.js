import { db } from '../../config/db.js';


const examModel = {
// Create a new exam
 createExam : (examData, callback) => {
  const { school, class_name, level, date_from, date_to } = examData;
  const query = 'INSERT INTO exam (school, class, level, date_from, date_to) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [school, class_name, level, date_from, date_to], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
},

// Get all exams
 getExams : (callback) => {
  const query = 'SELECT * FROM exam';
  db.query(query, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
},

// Get a specific exam by ID
 getExamById :(id, callback) => {
  const query = 'SELECT * FROM exam WHERE id = ?';
  db.query(query, [id], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
},

// Update an exam by ID
updateExam: (id, examData, callback) => {
  const { school, class_name, level, date_from, date_to } = examData;
  const query = 'UPDATE exam SET school = ?, class = ?, level = ?, date_from = ?, date_to = ? WHERE id = ?';
  db.query(query, [school, class_name, level, date_from, date_to, id], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
},

// Delete an exam by ID
 deleteExam :(id, callback) => {
  const query = 'DELETE FROM exam WHERE id = ?';
  db.query(query, [id], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
},

};
export default examModel;