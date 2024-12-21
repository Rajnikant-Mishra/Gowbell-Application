import { District } from '../../models/Region/District.js';

export const createDistrict = (req, res) => {
  const { name, country_id, state_id, status } = req.body;

  // Call the model's create method
  District.create(name, country_id, state_id, status, (err, result) => {
    if (err) {
      // Handle the duplicate district error
      if (err.message === 'District already exists') {
        return res.status(400).json({ error: 'District already exists' });
      }
      return res.status(500).json({ error: 'Error creating district', details: err.message });
    }
    
    // Return success if no error
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

  // Validate the request data
  if (!name || !country_id || !state_id || !status) {
    return res.status(400).json({ error: 'All fields (name, country_id, state_id, status) are required' });
  }

  // Call the model's update method
  District.update(id, name, country_id, state_id, status, (err, result) => {
    if (err) {
      console.error('Error in controller:', err.message); // Log error from the model
      return res.status(500).json({ error: 'Error updating district', details: err.message });
    }
    
    // Check if the update affected any rows
    if (result && result.affectedRows === 0) {
      return res.status(404).json({ error: 'District not found' });
    }

    // Successful update
    res.status(200).json({ message: 'District updated successfully' });
  });
};

export const deleteDistrict = (req, res) => {
  const { id } = req.params;
  District.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'District deleted' });
  });
};
