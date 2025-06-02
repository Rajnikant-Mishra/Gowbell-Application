import OmrData from "../../models/Exam/omrModel.js";

// Create a new record
export const createOmr = (req, res) => {
  const omrRecords = req.body; // Expecting an array of OMR records

  if (!Array.isArray(omrRecords) || omrRecords.length === 0) {
    return res.status(400).json({ error: "Invalid OMR data" });
  }

  const userId = req.user?.id || "system";

  const promises = omrRecords.map(
    (data) =>
      new Promise((resolve, reject) => {
        const recordWithAudit = {
          ...data,
          classes: data.classes || [], // default empty array if not present
          subjects: data.subjects || [],
          created_by: userId,
          updated_by: userId,
        };

        OmrData.create(recordWithAudit, (err, result) => {
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

// Get all data
export const getAllOmrData = (req, res) => {
  OmrData.getAll((err, results) => {
    if (err) {
      console.error("Error fetching OMR data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error", error: err });
    }
    return res.status(200).json({ success: true, data: results });
  });
};

export const getOmrById = (req, res) => {
  const id = req.params.id;
  OmrData.getById(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve record", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "OMR record not found" });
    }
    res.status(200).json(result[0]);
  });
};

// UPDATE
export const updateOmr = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const userId = req.user?.id || "system";

  const updatedData = {
    ...data,
    updated_by: userId,
    classes: data.classes || [],
    subjects: data.subjects || [],
  };

  OmrData.update(id, updatedData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Update failed", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "OMR record not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "OMR record updated successfully" });
  });
};

// Delete OMR data by ID
export const deleteOmrData = (req, res) => {
  const id = req.params.id;

  OmrData.delete(id, (err, results) => {
    if (err) {
      console.error("Error deleting OMR data:", err);
      return res
        .status(500)
        .json({ success: 0, message: "Database error", error: err });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: 0, message: "OMR data not found" });
    }

    return res
      .status(200)
      .json({ success: 1, message: "OMR data deleted successfully" });
  });
};
