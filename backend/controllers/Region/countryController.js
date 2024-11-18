import { Country } from '../../models/Region/Country.js';

export const createCountry = (req, res) => {
  const { name, status } = req.body;
  Country.create(name, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Country created', countryId: result.insertId });
  });
};

export const getAllCountries = (req, res) => {
  Country.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

export const getCountryById = (req, res) => {
  const { id } = req.params;
  Country.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Country not found' });
    res.status(200).json(result[0]);
  });
};

export const updateCountry = (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  Country.update(id, name, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Country updated' });
  });
};

export const deleteCountry = (req, res) => {
  const { id } = req.params;
  Country.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Country deleted' });
  });
};
