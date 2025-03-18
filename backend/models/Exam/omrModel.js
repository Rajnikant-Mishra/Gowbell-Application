import {db} from '../../config/db.js';

const OmrData = {
  // Create new OMR record
  create: (data, callback) => {
    const query = `INSERT INTO omr_data (school, level, student_id, student_name, roll_number, is_checked) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [data.school, data.level, data.student_id, data.student_name, data.roll_number, data.is_checked], callback);
  },

  
};

export default OmrData;
