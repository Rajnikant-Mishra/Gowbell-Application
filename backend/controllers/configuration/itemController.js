import Item from "../../models/configuration/itemModel.js";

export const getAllItems = (req, res) => {
  Item.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

export const getItemById = (req, res) => {
  const id = req.params.id;
  Item.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

export const createItem = (req, res) => {
  const data = req.body;
  Item.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Item created successfully', id: result.insertId });
  });
};

export const updateItem = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  Item.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Item updated successfully' });
  });
};

export const deleteItem = (req, res) => {
  const id = req.params.id;
  Item.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Item deleted successfully' });
  });
};
