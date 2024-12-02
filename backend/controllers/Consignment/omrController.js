import Omr from '../../models/Consignment/omrModel.js';

// Create a new student
export const createStudent = (req, res) => {
    const { school_name, class_from, class_to, omr } = req.body;
    const newStudent = { school_name, class_from, class_to, omr };

    Omr.create(newStudent, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Student created', studentId: result.insertId });
    });
};

// Get all students
export const getAllStudents = (req, res) => {
    Omr.getAll((err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
};

// Get a single student by ID
export const getStudentById = (req, res) => {
    const { id } = req.params;
    Omr.getById(id, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Student not found');
        res.status(200).send(result[0]);
    });
};

// Update a student by ID
export const updateStudent = (req, res) => {
    const { id } = req.params;
    const { school_name, class_from, class_to, omr } = req.body;
    const updatedStudent = { school_name, class_from, class_to, omr };

    Omr.update(id, updatedStudent, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Student not found');
        res.status(200).send({ message: 'Student updated' });
    });
};

// Delete a student by ID
export const deleteStudent = (req, res) => {
    const { id } = req.params;
    Omr.delete(id, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Student not found');
        res.status(200).send({ message: 'Student deleted' });
    });
};

