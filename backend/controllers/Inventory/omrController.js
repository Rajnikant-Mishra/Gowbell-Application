import  Omr from '../../models/Inventory/omrModel.js';

// Create a new OMR entry
export const createOmr = (req, res) => {
  const { title, quantity } = req.body;
  const newOmr = { title, quantity };

  Omr.create(newOmr, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'OMR created', omrId: result.insertId });
  });
};

// Get all OMR entries
export const getAllOmr = (req, res) => {
  Omr.getAll((err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
};

// Get a single OMR entry by ID
export const getOmrById = (req, res) => {
  const { id } = req.params;
  Omr.getById(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('OMR not found');
    res.status(200).send(result[0]);
  });
};

// Update a OMR entry by ID
export const updateOmr = (req, res) => {
  const { id } = req.params;
  const { title, quantity } = req.body;
  const updatedOmr = { title, quantity };

  Omr.update(id, updatedOmr, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('OMR not found');
    res.status(200).send({ message: 'OMR updated' });
  });
};

// Delete a OMR entry by ID
export const deleteOmr = (req, res) => {
  const { id } = req.params;
  Omr.delete(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send('OMR not found');
    res.status(200).send({ message: 'OMR deleted' });
  });
};
