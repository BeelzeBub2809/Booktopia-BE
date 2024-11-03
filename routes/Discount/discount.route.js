const express = require('express');
const DiscountController = require('../../controllers/discount.controller');

const DiscountRouter = express.Router();

// Define routes for discounts
DiscountRouter.get('/', DiscountController.getAllDiscounts);
DiscountRouter.get('/:id', DiscountController.getDiscountById);
DiscountRouter.post('/', DiscountController.createDiscount);
DiscountRouter.put('/:id', DiscountController.updateDiscount);
DiscountRouter.delete('/:id', DiscountController.deleteDiscount);

module.exports = DiscountRouter;