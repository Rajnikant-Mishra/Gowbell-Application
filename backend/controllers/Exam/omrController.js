import OmrData from '../../models/Exam/omrModel.js';

// Create a new record

export const createOmr = (req, res) => {
    const omrRecords = req.body; // Expecting an array of OMR records
  
    if (!Array.isArray(omrRecords) || omrRecords.length === 0) {
      return res.status(400).json({ error: "Invalid OMR data" });
    }
  
    // Insert each OMR record into the database
    const promises = omrRecords.map(
      (data) =>
        new Promise((resolve, reject) => {
          OmrData.create(data, (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
          });
        })
    );
  
    Promise.all(promises)
      .then((ids) =>
        res.status(201).json({
          message: "OMR data created successfully",
          insertedIds: ids,
        })
      )
      .catch((err) => res.status(500).json({ error: err.message }));
  };

