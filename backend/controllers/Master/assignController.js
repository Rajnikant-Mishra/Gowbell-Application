import AssignCenter from "../../models/Master/assignModel.js";
import { db } from "../../config/db.js";

// Create
export const createAssignCenter = (req, res) => {
  const data = req.body;

  if (!data.assign_center_name_id || !data.school_id) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  AssignCenter.create(data, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({
      message: "Assign Center created successfully",
      id: result.insertId,
    });
  });
};

// Read All
export const getAllAssignCenters = (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  AssignCenter.getAllPaginated(Number(page), Number(limit), (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result);
  });
};

// Read One
export const getAssignCenterById = (req, res) => {
  const { id } = req.params;
  AssignCenter.getById(id, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(result[0]);
  });
};

// Update
export const updateAssignCenter = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  AssignCenter.update(id, data, (err) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Assign Center updated successfully" });
  });
};

// Delete
export const deleteAssignCenter = (req, res) => {
  const { id } = req.params;

  AssignCenter.delete(id, (err) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Assign Center deleted successfully" });
  });
};
