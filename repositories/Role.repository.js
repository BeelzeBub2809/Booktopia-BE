const { Role } = require('../models');

    async function getAllRoles() {
        try {
            return await Role.find();
        } catch (error) {
            throw new Error('Error fetching roles: ' + error.message);
        }
    }

    async function getRoleById(roleId) {
        try {
            return await Role.findById(roleId);
        } catch (error) {
            throw new Error('Error fetching role: ' + error.message);
        }
    }

    async function createRole(roleData) {
        try {
            return await Role.create(roleData);
        } catch (error) {
            throw new Error('Error creating role: ' + error.message);
        }
    }

    async function updateRole(roleId, roleData) {
        try {
            return await Role.findByIdAndUpdate(roleId, roleData, { new: true });
        } catch (error) {
            throw new Error('Error updating role: ' + error.message);
        }
    }

    async function deleteRole(roleId) {
        try {
            return await Role.findByIdAndDelete(roleId);
        } catch (error) {
            throw new Error('Error deleting role: ' + error.message);
        }
    }

    async function getRoleByName(roleName) {
        try {
            return await Role.findOne
            ({role: roleName});
        }catch(error){
            throw new Error('Error fetching role: ' + error.message);
        }
    }

    const RoleRepository = {
        getAllRoles,
        getRoleById,
        createRole,
        updateRole,
        deleteRole,
        getRoleByName
    }

module.exports = RoleRepository;