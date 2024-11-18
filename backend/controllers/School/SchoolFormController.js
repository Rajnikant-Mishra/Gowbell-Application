import School from '../../models/School/SchoolFormModel.js';

// Get all schools
export const getAllSchools = (req, res) => {
    School.getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
};

// Get school by ID
export const getSchoolById = (req, res) => {
    const id = req.params.id;
    School.getById(id, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('School not found');
        res.status(200).json(results[0]);
    });
};

// Create a new school
export const createSchool = (req, res) => {
    const data = req.body;
    School.create(data, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'School created', id: results.insertId });
    });
};

// Update school
export const updateSchool = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    School.update(id, data, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'School updated' });
    });
};

// Delete school
export const deleteSchool = (req, res) => {
    const id = req.params.id;
    School.delete(id, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ message: 'School deleted' });
    });
};
