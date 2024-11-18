// controllers/districtController.js
import { District } from '../../models/Region/District.js';


export const createDistrict = (req, res) => {
  const { name, country_id, state_id, status } = req.body;
  District.create(name, country_id, state_id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'District created', districtId: result.insertId });
  });
};

export const getAllDistricts = (req, res) => {
  District.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

export const getDistrictById = (req, res) => {
  const { id } = req.params;
  District.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'District not found' });
    res.status(200).json(result[0]);
  });
};

export const updateDistrict = (req, res) => {
  const { id } = req.params;
  const { name, country_id, state_id, status } = req.body;
  District.update(id, name, country_id, state_id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'District updated' });
  });
};

export const deleteDistrict = (req, res) => {
  const { id } = req.params;
  District.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'District deleted' });
  });
};
