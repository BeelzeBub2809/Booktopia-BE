const express = require('express');
const {CartController} = require('../../controllers');

const CartRouter = express.Router();

// Get Cart
CartRouter.get('/:userId', CartController.getCart);
// Add Product to Cart
CartRouter.post('/:userId', CartController.addProductToCart);

module.exports = CartRouter;