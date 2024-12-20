const express = require('express');
const AuthRouter = require('./Auth/auth.route');
const ProductRouter = require('./Product/product.route');
const UserRouter = require('./User/user.route');
const RoleRouter = require('./Role/role.route');
const ReviewRouter = require('./Review/Review.route');
const OrderRouter = require('./Order/order.route');
const CategoryRouter = require('./Category/category.route');
const CartRouter = require('./Cart/Cart.route');
const ComboRouter = require('./Combo/combo.route');
const RefundRouter = require('./Refund/refund.route');
const MomoRouter = require('./Momo/momo.route');
const DiscountRouter = require('./Discount/discount.route');
const ReportRouter = require('./Report/Report.route');
const Helper = require('../helper/helper');
const router = express.Router();

// Test route to check connection

router.use('/auth', AuthRouter);
router.use('/product', ProductRouter);
router.use('/order', OrderRouter);
router.use('/role', RoleRouter);
router.use('/user', UserRouter);
router.use('/review', ReviewRouter);
router.use('/category', CategoryRouter);
router.use('/cart', CartRouter);
router.use('/combo', ComboRouter);
router.use('/refund', RefundRouter);
router.use('/payment', MomoRouter);
router.use('/discount', DiscountRouter);
router.use('/report', ReportRouter);

// Route to test sendEmail function
router.get('/test-email', async (req, res) => {
    try {
        await Helper.sendEmail('hientrantu0@gmail.com', 'Test Subject', 'Test email body');
        res.send('Email sent successfully');
    } catch (error) {
        res.status(500).send('Error sending email');
    }
});

module.exports = router;