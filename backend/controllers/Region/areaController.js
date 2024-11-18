// controllers/areaController.js
import { Area } from '../../models/Region/Area.js';


export const createArea = (req, res) => {
  const { name, country_id, state_id, district_id, city_id, status } = req.body;
  Area.create(name, country_id, state_id, district_id, city_id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Area created', areaId: result.insertId });
  });
};

export const getAllAreas = (req, res) => {
  Area.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

export const getAreaById = (req, res) => {
  const { id } = req.params;
  Area.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Area not found' });
    res.status(200).json(result[0]);
  });
};

export const updateArea = (req, res) => {
  const { id } = req.params;
  const { name, country_id, state_id, district_id, city_id, status } = req.body;
  Area.update(id, name, country_id, state_id, district_id, city_id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Area updated' });
  });
};

export const deleteArea = (req, res) => {
  const { id } = req.params;
  Area.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Area deleted' });
  });
};
