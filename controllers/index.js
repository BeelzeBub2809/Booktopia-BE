const { Combo } = require('../models');
const AuthController = require('./auth.controller');
const CartController = require('./Cart.controller');
const CategoryController = require('./category.controller');
const ComboController = require('./Combo.controller');
const OrderController = require('./order.controller');
const ProductController = require('./product.controller');
const ReviewController = require('./Review.controller');
const RoleController = require('./Role.controller');
const UserController = require('./user.controller');

module.exports = {
    AuthController,
    ProductController,
    OrderController,
    CartController,
    RoleController,
    UserController,
    ReviewController,
    CategoryController,
    ComboController,
};