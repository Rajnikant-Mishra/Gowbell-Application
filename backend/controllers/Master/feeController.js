import { Fee } from "../../models/Master/feeModel.js";

export const createFee = (req, res) => {
  const { subject_fee } = req.body;

  Fee.create(subject_fee, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, subject_fee });
  });
};

export const getAllFees = (req, res) => {
  Fee.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getAll = (req, res) => {
  const { page, limit } = req.query;

  Fee.getAll(page, limit, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getFeeById = (req, res) => {
  const { id } = req.params;
  Fee.findById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Record not found" });
    res.json(result[0]);
  });
};

export const updateFee = (req, res) => {
  const { id } = req.params;
  const { subject_fee } = req.body;

  Fee.update(id, subject_fee, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record updated successfully" });
  });
};

export const deleteFee = (req, res) => {
  const { id } = req.params;

  Fee.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  });
};
