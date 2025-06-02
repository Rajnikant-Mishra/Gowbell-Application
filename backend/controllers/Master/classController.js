import { Class } from "../../models/Master/classModel.js";

// CREATE - Add a new record
// export const createClass = (req, res) => {
//     const { name, status } = req.body;
//     Class.create(name, status, (err, result) => {
//         if (err) {
//             if (err.code === 'ER_DUP_ENTRY') {
//                 return res.status(400).json({ error: 'Class name must be unique' });
//             }
//             return res.status(500).json({ error: err });
//         }
//         res.status(201).json({ id: result.insertId, name, status });
//     });
// };
export const createClass = (req, res) => {
  const { name, status } = req.body;
  const created_by = req.user.id; // Auto-generated from the logged-in user

  Class.create(name, status, created_by, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Class name must be unique" });
      }
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ id: result.insertId, name, status, created_by });
  });
};

// READ - Get all records
export const getAllClasses = (req, res) => {
  Class.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getAll= (req, res) => {
  const { page, limit, search } = req.query;

  Class.getAll(page, limit, search, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// READ - Get a single record by ID
export const getClassById = (req, res) => {
  const { id } = req.params;
  Class.findById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Record not found" });
    res.json(result[0]);
  });
};

// UPDATE - Update a record by ID
export const updateClass = (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  Class.update(id, name, status, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Class name must be unique" });
      }
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record updated successfully" });
  });
};

// DELETE - Delete a record by ID
export const deleteClass = (req, res) => {
  const { id } = req.params;
  Class.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  });
};
