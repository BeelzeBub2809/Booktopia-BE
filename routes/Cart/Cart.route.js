const express = require('express');
const {CartController} = require('../../controllers');

const CartRouter = express.Router();

// Get Cart
CartRouter.get('/:id', CartController.getCart);
// Add Product to Cart
CartRouter.post('/:id', CartController.addProductToCart);

module.exports = CartRouter;