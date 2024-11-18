
import { Subject  } from '../../models/Master/subjectModel.js';



// CREATE - Add a new subject
export const createSubject = (req, res) => {
    const { name, status } = req.body;
    Subject.create(name, status, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ id: result.insertId, name, status });
    });
};

// READ - Get all subjects
export const getAllSubjects = (req, res) => {
    Subject.findAll((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// READ - Get a specific subject by ID
export const getSubjectById = (req, res) => {
    const { id } = req.params;
    Subject.findById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) return res.status(404).json({ message: 'Subject not found' });
        res.json(result[0]);
    });
};

// UPDATE - Update a subject by ID
export const updateSubject = (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    Subject.update(id, name, status, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject updated successfully' });
    });
};

// DELETE - Delete a subject by ID
export const deleteSubject = (req, res) => {
    const { id } = req.params;
    Subject.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject deleted successfully' });
    });
};
