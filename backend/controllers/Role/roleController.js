import  Role from '../../models/Role/roleModel.js';


// Create a new role
export const createRole = (req, res) => {
    const { role_name } = req.body;
    Role.create(role_name, (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error creating role' });
        }
        res.status(201).send({ message: 'Role created successfully', id: result.insertId });
    });
};

// Get all roles
export const getAllRoles = (req, res) => {
    Role.getAll((err, roles) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching roles' });
        }
        res.status(200).send(roles);
    });
};

// Get a role by its ID
export const getRoleById = (req, res) => {
    const { id } = req.params;
    Role.getById(id, (err, role) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching role' });
        }
        if (!role) {
            return res.status(404).send({ message: 'Role not found' });
        }
        res.status(200).send(role);
    });
};

// Update a role by its ID
export const updateRole = (req, res) => {
    const { id } = req.params;
    const { role_name } = req.body;
    Role.update(id, role_name, (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error updating role' });
        }
        res.status(200).send({ message: 'Role updated successfully' });
    });
};

// Delete a role by its ID
export const deleteRole = (req, res) => {
    const { id } = req.params;
    Role.delete(id, (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error deleting role' });
        }
        res.status(200).send({ message: 'Role deleted successfully' });
    });
};


