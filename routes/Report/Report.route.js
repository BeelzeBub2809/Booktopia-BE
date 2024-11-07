const express = require('express');
const { ReportController } = require('../../controllers');

const ReportRouter = express.Router();

// Example route for getting stock in total
ReportRouter.get('/stock-in-total', ReportController.getStockIn);

// Route for getting stock out total
ReportRouter.get('/stock-out-total', ReportController.getStockOut);

// Route for getting profit total
ReportRouter.get('/profit-total', ReportController.getProfit);

// Route for getting top 5 products by sales
ReportRouter.get('/top-5-products-sales', ReportController.getTop5ProductsBySales);

module.exports = ReportRouter;