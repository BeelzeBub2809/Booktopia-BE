const express = require('express');
const {OrderController} = require('../../controllers');

const OrderRouter = express.Router();

OrderRouter.get('/', OrderController.getAllOrders);

OrderRouter.get('/user/:userid', OrderController.getUserOrder);

OrderRouter.post('/preview', OrderController.previewOrder);

OrderRouter.post('/cancel/:id', OrderController.cancelOrder);

OrderRouter.post('/', OrderController.createNewOrder);

OrderRouter.put('/', OrderController.updateOrder);

module.exports = OrderRouter;