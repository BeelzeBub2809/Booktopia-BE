const express = require('express');
const {CartController} = require('../../controllers');

const CartRouter = express.Router();

// Get Cart
CartRouter.get('/:userId', CartController.getCart);
// Add Product to Cart
CartRouter.post('/:userId/add_to_cart', CartController.addProductToCart);

//update product in cart
CartRouter.post('/:userId/update', CartController.updateCart);

module.exports = CartRouter;