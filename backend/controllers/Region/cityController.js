// controllers/cityController.js
import { City } from '../../models/Region/City.js';


export const createCity = (req, res) => {
  const { name, country_id, state_id, district_id, status } = req.body;
  City.create(name, country_id, state_id, district_id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'City created', cityId: result.insertId });
  });
};

export const  getAllCities = (req, res) => {
  City.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

export const getCityById = (req, res) => {
  const { id } = req.params;
  City.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'City not found' });
    res.status(200).json(result[0]);
  });
};

export const updateCity = (req, res) => {
  const { id } = req.params;
  const { name, country_id, state_id, district_id, status } = req.body;
  City.update(id, name, country_id, state_id, district_id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'City updated' });
  });
};

export const deleteCity = (req, res) => {
  const { id } = req.params;
  City.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'City deleted' });
  });
};
