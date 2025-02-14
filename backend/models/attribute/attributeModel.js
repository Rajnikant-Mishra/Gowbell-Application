import { db } from "../../config/db.js";

const Attribute = {
    //================================================
    createAttribute: (attributeData, callback) => {
        const { attribute_name, rows } = attributeData;

          const rowQuery = "INSERT INTO attributes (attribute_name, ckey, cvalue, display_sequence) VALUES ?";
          const rowValues = rows.map((row) => [
            attribute_name,
            row.ckey,
            row.cvalue,
            row.display_sequence,
          ]);
      
          db.query(rowQuery, [rowValues], (err, rowResults) => {
            if (err) {
              callback(err);
              return;
            }
      
            callback(null, { rowResults });
          });
       
      },
      //---------------------------------------------------
       getAllAttributes: (callback) => {
        const query = "SELECT * FROM attributes ORDER BY display_sequence";
        db.query(query, (err, results) => {
          if (err) {
            callback(err);
            return;
          }
          callback(null, results);
        });
      },
      //====================
      getAttributeById: (id, callback) => {
        const query = "SELECT * FROM attributes WHERE id = ?";
        db.query(query, [id], (err, results) => {
          if (err) {
            callback(err);
            return;
          }
          const result = results[0] || {};  // Safe fallback for empty results
          callback(null, result);
        });
      },
      
      //============================================
       updateAttribute: (id, attributeData, callback) => {
        const { attribute_name, rows } = attributeData;
      
        // Update the attribute itself
        const query = "UPDATE attributes SET attribute_name = ?, updated_at = NOW() WHERE id = ?";
        db.query(query, [attribute_name, id], (err, results) => {
          if (err) {
            callback(err);
            return;
          }
      
          // Update rows associated with the attribute
          const rowQuery = "UPDATE attributes SET ckey = ?, cvalue = ?, display_sequence = ? WHERE attribute_id = ?";
          rows.forEach((row) => {
            db.query(rowQuery, [row.ckey, row.cvalue, row.display_sequence, id], (err) => {
              if (err) {
                callback(err);
                return;
              }
            });
          });
      
          callback(null, results);
        });
      },
      
    deleteAttribute: (id, callback) => {
        const query = "DELETE FROM attributes WHERE id = ?";
        db.query(query, [id], (err, results) => {
          if (err) {
            callback(err);
            return;
          }
          callback(null, results);
        });
      },
      

      // Fetch attribute cvalue dynamically when attribute_name is "item"
  getItemAttributeValues: (callback) => {
    const query =
      "SELECT cvalue FROM attributes WHERE attribute_name = 'item'";
    db.query(query, (err, results) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, results);
    });
  },
      
     
};

export default Attribute ;

