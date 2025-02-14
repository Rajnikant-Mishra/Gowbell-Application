import Role from '../../models/Role/roleModel.js';

// Create a new role
export const createRole = (req, res) => {
    const { role_name, permissions } = req.body;
    Role.create(role_name, permissions, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating role', error: err });
        }
        res.status(201).json({ message: 'Role created successfully', id: result.insertId });
    });
};

// Get all roles
export const getAllRoles = (req, res) => {
    Role.getAll((err, roles) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching roles' });
        }
        res.status(200).json(roles);
    });
};

// Get a role by ID
export const getRoleById = (req, res) => {
    const { id } = req.params;
    Role.getById(id, (err, role) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching role' });
        }
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    });
};



// Update a role
export const updateRole = (req, res) => {
    const { id } = req.params;
    const { role_name, permissions } = req.body;
    Role.update(id, role_name, permissions, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating role' });
        }
        res.status(200).json({ message: 'Role updated successfully' });
    });
};

// Delete a role
export const deleteRole = (req, res) => {
    const { id } = req.params;
    Role.delete(id, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting role' });
        }
        res.status(200).json({ message: 'Role deleted successfully' });
    });
};
