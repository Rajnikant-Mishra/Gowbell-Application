// controllers/stateController.js
import  {State} from '../../models/Region/State.js';

export const createState = (req, res) => {
  const { name, status, country_id } = req.body;
  State.create(name, status, country_id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'State created', stateId: result.insertId });
  });
};

export const getAllStates = (req, res) => {
  State.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

export const getStateById = (req, res) => {
  const { id } = req.params;
  State.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'State not found' });
    res.status(200).json(result[0]);
  });
};
export const updateState = (req, res) => {
  const { id } = req.params;
  const { name, status, country_id } = req.body;
  State.update(id, name, status, country_id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'State updated' });
  });
};

export const deleteState = (req, res) => {
  const { id } = req.params;
  State.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'State deleted' });
  });
};
