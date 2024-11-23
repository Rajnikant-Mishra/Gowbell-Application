import Incharge from '../../models/Incharge/inchargeModel.js';

// Create a new incharge
export const createIncharge = (req, res) => {
    const { school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to } = req.body;
    const newIncharge = { school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to };

    Incharge.create(newIncharge, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Incharge created', inchargeId: result.insertId });
    });
};

// Get all incharges
export const getAllIncharges = (req, res) => {
    Incharge.getAll((err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
};

// Get a single incharge by ID
export const getInchargeById = (req, res) => {
    const { id } = req.params;
    Incharge.getById(id, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Incharge not found');
        res.status(200).send(result[0]);
    });
};

// Update an incharge by ID
export const updateIncharge = (req, res) => {
    const { id } = req.params;
    const { school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to } = req.body;
    const updatedIncharge = { school_name, incharge_name, incharge_dob, mobile_number, class_from, class_to };

    Incharge.update(id, updatedIncharge, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Incharge not found');
        res.status(200).send({ message: 'Incharge updated' });
    });
};

// Delete an incharge by ID
export const deleteIncharge = (req, res) => {
    const { id } = req.params;
    Incharge.delete(id, (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Incharge not found');
        res.status(200).send({ message: 'Incharge deleted' });
    });
};