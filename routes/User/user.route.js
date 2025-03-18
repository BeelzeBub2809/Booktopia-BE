const express = require('express');
const {UserController} = require('../../controllers');
const AuthMiddlewares = require('../../middlewares/auth.middleware');

const UserRouter = express.Router();

// Define routes for roles
UserRouter.get('/', UserController.getAllUsers);
UserRouter.get('/:id', UserController.getUserById);
UserRouter.post('/', AuthMiddlewares.verifyUser, UserController.createUser);
UserRouter.put('/:id', UserController.updateUser);
UserRouter.delete('/:id', UserController.deleteUser);

module.exports = UserRouter;