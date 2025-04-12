import  OmrReceipt from "../../models/Exam/omrReceiptModel.js";

// Get all receipts
export const getAllReceipts = (req, res) => {
  OmrReceipt.getAll((err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};


// Get receipt by ID
export const getReceiptById = (req, res) => {
  OmrReceipt.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
};

// Create new receipt
export const createReceipt = (req, res) => {
  OmrReceipt.create(req.body, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Receipt created successfully', id: result.insertId });
  });
};

// Update receipt
export const updateReceipt = (req, res) => {
  OmrReceipt.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Receipt updated successfully' });
  });
};

// Delete receipt
export const deleteReceipt = (req, res) => {
  OmrReceipt.delete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Receipt deleted successfully' });
  });
};
