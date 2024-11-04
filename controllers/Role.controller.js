const mongoose = require('mongoose');
const RoleRepository = require('../repositories/Role.repository');
const Helper = require('../helper/helper');

async function getAllRoles(req, res) {
    try {
        const roles = await RoleRepository.getAllRoles();
        Helper.sendSuccess(res, 200, roles, "Roles were fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function getRoleById(req, res) {
    try {
        const role = await RoleRepository.getRoleById(req.params.id);
        if (!role) {
            Helper.sendFail(res, 404, "Role not found");
            return;
        }
        Helper.sendSuccess(res, 200, role, "Role was fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function createRole(req, res) {
    try {
        const newRole = await RoleRepository.createRole(req.body);
        Helper.sendSuccess(res, 200, newRole, "Role was created successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function updateRole(req, res) {
    try {
        const updatedRole = await RoleRepository.updateRole(req.params.id, req.body);
        if (!updatedRole) {
            Helper.sendFail(res, 404, "Role not found");
            return;
        }
        Helper.sendSuccess(res, 200, updatedRole, "Role was updated successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function deleteRole(req, res) {
    try {
        const deletedRole = await RoleRepository.deleteRole(req.params.id);
        if (!deletedRole) {
            Helper.sendFail(res, 404, "Role not found");
            return;
        }
        Helper.sendSuccess(res, 200, deletedRole, "Role was deleted successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
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