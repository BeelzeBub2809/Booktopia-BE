const { Role } = require('../models');

class RoleRepository {
    async getAllRoles() {
        try {
            return await Role.find();
        } catch (error) {
            throw new Error('Error fetching roles: ' + error.message);
        }
    }

    async getRoleById(roleId) {
        try {
            return await Role.findById(roleId);
        } catch (error) {
            throw new Error('Error fetching role: ' + error.message);
        }
    }

    async createRole(roleData) {
        try {
            return await Role.create(roleData);
        } catch (error) {
            throw new Error('Error creating role: ' + error.message);
        }
    }

    async updateRole(roleId, roleData) {
        try {
            return await Role.findByIdAndUpdate(roleId, roleData, { new: true });
        } catch (error) {
            throw new Error('Error updating role: ' + error.message);
        }
    }

    async deleteRole(roleId) {
        try {
            return await Role.findByIdAndDelete(roleId);
        } catch (error) {
            throw new Error('Error deleting role: ' + error.message);
        }
    }

    async getRoleByName(roleName) {
        try {
            return await Role.findOne
            ({role: roleName});
        }catch(error){
            throw new Error('Error fetching role: ' + error.message);
        }
    }
}

module.exports = new RoleRepository();