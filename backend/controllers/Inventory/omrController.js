import { Omr } from '../../models/Inventory/omrModel.js';

// Create a new book
export const createOmr = (req, res) => {
  const { title, quantity } = req.body;
  const newOmr = {title, quantity };

  Omr.create(newOmr, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Omr created', bookId: result.insertId });
  });
};

// Get all books
export const getAllOmrs = (req, res) => {
  Omr.getAll((err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
};

// Get a single book by ID
export const getOmrById = (req, res) => {
  const { id } = req.params;
  Omr.getById(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('Omr not found');
    res.status(200).send(result[0]);
  });
};

// Update a book by ID
export const updateOmr = (req, res) => {
  const { id } = req.params;
  const {title, quantity } = req.body;
  const updatedOmr = { title, quantity};

  Omr.update(id, updatedOmr, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Omr not found');
    res.status(200).send({ message: 'Omr updated' });
  });
};

// Delete a book by ID
export const deleteOmr = (req, res) => {
  const { id } = req.params;
  Omr.delete(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('Omr not found');
    res.status(200).send({ message: 'Omr deleted' });
  });
};
