const express = require('express');
const DiscountController = require('../../controllers/discount.controller');
const AuthMiddlewares = require('../../middlewares/auth.middleware');

const DiscountRouter = express.Router();

// Define routes for discounts
DiscountRouter.get('/', DiscountController.getAllDiscounts);
DiscountRouter.post('/getByPid', DiscountController.getHighestDiscountsByProductId);
DiscountRouter.get('/:id', DiscountController.getDiscountById);
DiscountRouter.post('/', AuthMiddlewares.verifyUser, DiscountController.createDiscount);
DiscountRouter.put('/:id', AuthMiddlewares.verifyUser, DiscountController.updateDiscount);
DiscountRouter.delete('/:id', DiscountController.deleteDiscount);

module.exports = DiscountRouter;