import Session from '../../models/session/sessionModel.js';

export const getAllSessions = (req, res) => {
  Session.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getSessionById = (req, res) => {
  const id = req.params.id;
  Session.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Session not found' });
    res.json(result[0]);
  });
};

export const createSession = (req, res) => {
  const data = req.body;
  Session.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Session created', id: result.insertId });
  });
};

export const updateSession = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  Session.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Session updated' });
  });
};

export const deleteSession = (req, res) => {
  const id = req.params.id;
  Session.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Session deleted' });
  });
};
