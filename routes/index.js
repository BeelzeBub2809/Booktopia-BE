const express = require('express');
const AuthRouter = require('./Auth/auth.route');
const ProductRouter = require('./Product/product.route');
const UserRouter = require('./User/user.route');
const RoleRouter = require('./Role/role.route');
const ReviewRouter = require('./Review/Review.route');
const OrderRouter = require('./Order/order.route');
const CategoryRouter = require('./Category/category.route');
const CartRouter = require('./Cart/Cart.route');

const router = express.Router();

// Test route to check connection

router.use('/auth', AuthRouter);
router.use('/product', ProductRouter);
router.use('/order',OrderRouter)
router.use('/role',RoleRouter)
router.use('/user',UserRouter)
router.use('/review',ReviewRouter)
router.use('/category',CategoryRouter)
router.use('/cart',CartRouter)

module.exports = router;