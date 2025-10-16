import OmrData from "../../models/Exam/omrModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { logActivity } from "../../models/dashboard/activityModel.js";

// Create a new record
// export const createOmr = (req, res) => {
//   let omrRecords;

//   try {
//     omrRecords = JSON.parse(req.body.data); // `data` = JSON string from FormData
//   } catch (err) {
//     return res.status(400).json({ error: "Invalid JSON format" });
//   }

//   if (!Array.isArray(omrRecords) || omrRecords.length === 0) {
//     return res.status(400).json({ error: "No OMR records provided" });
//   }

//   const userId = req.user?.id || "system";
//   const filename = req.file?.filename || null;

//   const promises = omrRecords.map((record) => {
//     return new Promise((resolve, reject) => {
//       const fullRecord = {
//         ...record,
//         classes: record.classes || [],
//         subjects: record.subjects || [],
//         created_by: userId,
//         updated_by: userId,
//         filename: filename, // same PDF for all records
//         status: record.status || "Inactive",
//       };

//       OmrData.create(fullRecord, (err, result) => {
//         if (err) reject(err);
//         else resolve(result.insertId);
//       });
//     });
//   });

//   Promise.all(promises)
//     .then((ids) =>
//       res.status(201).json({
//         message: "OMR data and PDF uploaded successfully",
//         insertedIds: ids,
//         filename: filename,
//       })
//     )
//     .catch((err) => res.status(500).json({ error: err.message }));
// };

export const createOmr = (req, res) => {
  let omrRecords;

  try {
    omrRecords = JSON.parse(req.body.data); // `data` = JSON string from FormData
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }

  if (!Array.isArray(omrRecords) || omrRecords.length === 0) {
    return res.status(400).json({ error: "No OMR records provided" });
  }

  const userId = req.user?.id || "system";
  const userName = req.user?.name || "System";
  const filename = req.file?.filename || null;

  const promises = omrRecords.map((record) => {
    return new Promise((resolve, reject) => {
      const fullRecord = {
        ...record,
        classes: record.classes || [],
        subjects: record.subjects || [],
        created_by: userId,
        updated_by: userId,
        filename: filename, // same PDF for all records
        status: record.status || "Inactive",
      };

      OmrData.create(fullRecord, (err, result) => {
        if (err) return reject(err);

        // ✅ Activity Log for each record
        try {
          logActivity({
            user_id: userId,
            user_name: userName,
            activity: `OMR record  has been created`,
            data: { omrId: result.insertId, filename },
            ip_address: req.ip || req.socket?.remoteAddress || null,
          });
        } catch (logErr) {
          console.error("Activity Log Error:", logErr.message);
        }

        resolve(result.insertId);
      });
    });
  });

  Promise.all(promises)
    .then((ids) =>
      res.status(201).json({
        message: "OMR data and PDF uploaded successfully",
        insertedIds: ids,
        filename: filename,
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
  const userName = req.user?.name || "System";

  const updatedData = {
    ...data,
    updated_by: userId,
    classes: data.classes || [],
    subjects: data.subjects || [],
  };

  // First, fetch the existing record for descriptive logging
  OmrData.getById(id, (fetchErr, existing) => {
    if (fetchErr) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch OMR record",
        error: fetchErr,
      });
    }

    if (!existing || existing.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "OMR record not found" });
    }

    OmrData.update(id, updatedData, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Update failed", error: err });
      }

      // ✅ Activity Log
      try {
        logActivity({
          user_id: userId,
          user_name: userName,
          activity: `OMR record "${id}" has been updated`,
          data: { omrId: id, updatedFields: updatedData },
          ip_address: req.ip || req.socket?.remoteAddress || null,
        });
      } catch (logErr) {
        console.error("Activity Log Error:", logErr.message);
      }

      return res
        .status(200)
        .json({ success: true, message: "OMR record updated successfully" });
    });
  });
};

// Delete OMR data by ID
// export const deleteOmrData = (req, res) => {
//   const id = req.params.id;

//   OmrData.delete(id, (err, results) => {
//     if (err) {
//       console.error("Error deleting OMR data:", err);
//       return res
//         .status(500)
//         .json({ success: 0, message: "Database error", error: err });
//     }

//     if (results.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ success: 0, message: "OMR data not found" });
//     }

//     return res
//       .status(200)
//       .json({ success: 1, message: "OMR data deleted successfully" });
//   });
// };

export const deleteOmrData = (req, res) => {
  const id = req.params.id;
  const userId = req.user?.id || "system";
  const userName = req.user?.name || "System";

  OmrData.delete(id, (err, results) => {
    if (err) {
      console.error("Error deleting OMR data:", err);
      return res
        .status(500)
        .json({ success: 0, message: "Database error", error: err });
    }

    // ✅ Activity Log
    try {
      logActivity({
        user_id: userId,
        user_name: userName,
        activity: `OMR record has been deleted`,
        data: { omrId: id },
        ip_address: req.ip || req.socket?.remoteAddress || null,
      });
    } catch (logErr) {
      console.error("Activity Log Error:", logErr.message);
    }

    return res
      .status(200)
      .json({ success: 1, message: "OMR data deleted successfully" });
  });
};

// Update filename for an OMR record
export const updateOmrFilename = (req, res) => {
  const { id } = req.params;
  const filename = req.file?.filename || null;
  const userId = req.user?.id || "system";

  if (!filename) {
    return res.status(400).json({ error: "No PDF file provided" });
  }

  OmrData.updateFilename(id, filename, userId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "OMR record not found" });
    }
    res.status(200).json({
      message: "Filename updated successfully",
      filename: filename,
    });
  });
};

export const downloadOmrById = (req, res) => {
  const { id } = req.params;

  OmrData.getFilenameById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (!results || results.length === 0 || !results[0].filename) {
      return res.status(404).json({ error: "File not found" });
    }

    const filename = results[0].filename;

    // These two lines simulate __dirname in ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "../../uploads/omr_pdfs", filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: "File not found" });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.download(filePath, filename, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error downloading file" });
        }
      });
    });
  });
};

//packing list  getClassesAndOmrSet
export const getClassesAndOmrSetBySchoolAndSubject = (req, res) => {
  const { school, subject } = req.query;

  if (!school || !subject) {
    return res.status(400).json({ error: "school and subject are required" });
  }

  OmrData.getClassesAndOmrSetBySchoolAndSubject(
    school,
    subject,
    (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      const parsedResults = results.map((row) => {
        let classes;
        let classCount;

        // Handle classes (array, buffer, or string)
        if (Array.isArray(row.classes)) {
          classes = row.classes;
        } else {
          const rawClasses = row.classes?.toString?.() || "";
          try {
            classes = JSON.parse(rawClasses);
          } catch (e) {
            classes = rawClasses.split(",").map((c) => c.trim());
          }
        }

        // Handle class_count (JSON column)
        if (typeof row.class_count === "object" && row.class_count !== null) {
          classCount = row.class_count; // Already an object/array
        } else {
          const rawClassCount = row.class_count?.toString?.() || "";
          try {
            classCount = JSON.parse(rawClassCount);
          } catch (e) {
            classCount = rawClassCount; // Fallback to raw string if parsing fails
          }
        }

        return {
          classes,
          omr_set: row.omr_set,
          class_count: classCount,
        };
      });

      res.json(parsedResults);
    }
  );
};
