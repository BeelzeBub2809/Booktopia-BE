const express = require('express');
const {OrderController} = require('../../controllers');

const OrderRouter = express.Router();

OrderRouter.get('/', OrderController.getAllOrders);

// Route for user registration
OrderRouter.get('/user/:userid', OrderController.getUserOrder);

// Route for user login
OrderRouter.post('/', OrderController.createNewOrder);

// Route for user logout
OrderRouter.put('/', OrderController.updateOrder);

module.exports = OrderRouter;