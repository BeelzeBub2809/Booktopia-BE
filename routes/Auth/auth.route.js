const express = require('express');
const {AuthController} = require('../../controllers');

const AuthRouter = express.Router();

// Route for user registration
AuthRouter.post('/signup', AuthController.signup);

// Route for user login
AuthRouter.post('/login', AuthController.login);

// Route for user logout
AuthRouter.post('/logout', AuthController.logout);

module.exports = AuthRouter;