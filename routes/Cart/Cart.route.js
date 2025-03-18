const express = require('express');
const {CartController} = require('../../controllers');
const AuthMiddlewares = require('../../middlewares/auth.middleware');

const CartRouter = express.Router();

// Get Cart
CartRouter.get('/:userId', AuthMiddlewares.verifyUser, CartController.getCart);
// Add Product to Cart
CartRouter.post('/:userId/add_to_cart', AuthMiddlewares.verifyUser, CartController.addProductToCart);

CartRouter.post('/:userId/add_combo_to_cart', AuthMiddlewares.verifyUser, CartController.addComboToCart);

//update product in cart
CartRouter.post('/:userId/update', AuthMiddlewares.verifyUser, CartController.updateCart);

module.exports = CartRouter;