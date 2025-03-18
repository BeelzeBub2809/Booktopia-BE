const express = require('express');
const { ReportController } = require('../../controllers');
const AuthMiddlewares = require('../../middlewares/auth.middleware');

const ReportRouter = express.Router();

// Example route for getting stock in total
ReportRouter.post('/stock-in-total', AuthMiddlewares.verifyUser, ReportController.getStockIn);

// Route for getting stock out total
ReportRouter.post('/stock-out-total', AuthMiddlewares.verifyUser, ReportController.getStockOut);

// Route for getting profit total
ReportRouter.post('/profit-total', AuthMiddlewares.verifyUser, ReportController.getProfit);

// Route for getting top 5 products by sales
ReportRouter.post('/top-5-products-sales', AuthMiddlewares.verifyUser, ReportController.getTop5ProductsBySales);

module.exports = ReportRouter;