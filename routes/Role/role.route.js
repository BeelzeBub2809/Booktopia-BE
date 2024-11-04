const express = require('express');
const {RoleController} = require('../../controllers');

const RoleRouter = express.Router();

// Define routes for roles
RoleRouter.get('/', RoleController.getAllRoles);
RoleRouter.get('/:id', RoleController.getRoleById);
RoleRouter.post('/', RoleController.createRole);
RoleRouter.put('/:id', RoleController.updateRole);
RoleRouter.delete('/:id', RoleController.deleteRole);

module.exports = RoleRouter;