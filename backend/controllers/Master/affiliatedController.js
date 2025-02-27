import { Affiliated } from '../../models/Master/affiliatedModel.js';


// CREATE - Add a new affiliated entry
// export const createAffiliated = (req, res) => {
//     const { name, status } = req.body;
//     Affiliated.create(name, status, (err, result) => {
//         if (err) {
//             if (err.message.includes('already exists')) {
//                 return res.status(400).json({ error: err.message });
//             }
//             return res.status(500).json({ error: err });
//         }
//         res.status(201).json({ id: result.insertId, name, status });
//     });
// };

export const createAffiliated = (req, res) => {
    const { name, status } = req.body;
    const userId = req.user.id; // Extracted from JWT authentication middleware

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User ID is required' });
    }

    Affiliated.create(name, status, userId, (err, result) => {
        if (err) {
            if (err.message.includes('already exists')) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ id: result.insertId, name, status, created_by: userId });
    });
};


// READ - Get all affiliated entries
export const getAllAffiliated = (req, res) => {
    Affiliated.findAll((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// READ - Get a specific affiliated entry by ID
export const getAffiliatedById = (req, res) => {
    const { id } = req.params;
    Affiliated.findById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) return res.status(404).json({ message: 'Affiliated entry not found' });
        res.json(result[0]);
    });
};


// UPDATE - Update an affiliated entry by ID
export const updateAffiliated = (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    Affiliated.update(id, name, status, (err, result) => {
        if (err) {
            if (err.message.includes('already exists')) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Affiliated entry not found' });
        res.json({ message: 'Affiliated entry updated successfully' });
    });
};

// DELETE - Delete an affiliated entry by ID
export const deleteAffiliated = (req, res) => {
    const { id } = req.params;
    Affiliated.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Affiliated entry not found' });
        res.json({ message: 'Affiliated entry deleted successfully' });
    });
};
