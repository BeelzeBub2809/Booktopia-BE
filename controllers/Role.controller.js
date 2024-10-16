const mongoose = require('mongoose');
const RoleRepository = require('../repositories/Role.repository');

async function getAllRoles(req, res) {
    try {
        const roles = await RoleRepository.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving roles', error });
    }
}

async function getRoleById(req, res) {
    try {
        const role = await RoleRepository.getRoleById(req.params.id);
        if (!role) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving role', error });
    }
}

async function createRole(req, res) {
    try {
        const newRole = await RoleRepository.createRole(req.body);
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error });
    }
}

async function updateRole(req, res) {
    try {
        const updatedRole = await RoleRepository.updateRole(req.params.id, req.body);
        if (!updatedRole) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error });
    }
}

async function deleteRole(req, res) {
    try {
        const deletedRole = await RoleRepository.deleteRole(req.params.id);
        if (!deletedRole) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error });
    }
}

const RoleController = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};

module.exports = RoleController;