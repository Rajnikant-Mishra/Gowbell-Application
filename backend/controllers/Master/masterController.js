
import { Master  } from '../../models/Master/masterModel.js';


// CREATE - Add a new record
export const createMaster = (req, res) => {
    const { name, status } = req.body;
    Master.create(name, status, (err, result) => {
        
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ id: result.insertId, name, status });
    });
};

// READ - Get all records
export const getAllMasters = (req, res) => {
    Master.findAll((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// READ - Get a single record by ID
export const getMasterById = (req, res) => {
    const { id } = req.params;
    Master.findById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) return res.status(404).json({ message: 'Record not found' });
        res.json(result[0]);
    });
};

// UPDATE - Update a record by ID
export const updateMaster = (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    Master.update(id, name, status, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record updated successfully' });
    });
};

// DELETE - Delete a record by ID
export const deleteMaster = (req, res) => {
    const { id } = req.params;
    Master.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record deleted successfully' });
    });
};
