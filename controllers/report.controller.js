const mongoose = require('mongoose');
const AccountingRepository = require('../repositories/Accounting.repository');
const Helper = require('../helper/helper');

async function getStockIn(req, res) {
    try {
        const { reportType } = req.body;
        console.log(req.body);
        // Validate reportType
        const allowedReportTypes = ['week', 'month', 'year'];
        if (!allowedReportTypes.includes(reportType)) {
            return Helper.sendFail(res, 400, "Invalid report type. Allowed values are 'week', 'month', 'year'.");
        }

        const stockInTotal = await AccountingRepository.getStockInTotal(reportType);
        Helper.sendSuccess(res, 200, stockInTotal, "Stock in total was fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function getStockOut(req, res) {
    try {
        const { reportType } = req.body;

        // Validate reportType
        console.log(reportType);
        const allowedReportTypes = ['week', 'month', 'year'];
        if (!allowedReportTypes.includes(reportType)) {
            return Helper.sendFail(res, 400, "Invalid report type. Allowed values are 'week', 'month', 'year'.");
        }

        const stockOutTotal = await AccountingRepository.getStockOutTotal(reportType);
        Helper.sendSuccess(res, 200, stockOutTotal, "Stock out total was fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function getProfit(req, res) {
    try {
        const { reportType } = req.body;

        // Validate reportType
        const allowedReportTypes = ['week', 'month', 'year'];
        if (!allowedReportTypes.includes(reportType)) {
            return Helper.sendFail(res, 400, "Invalid report type. Allowed values are 'week', 'month', 'year'.");
        }

        const profitTotal = await AccountingRepository.getProfitTotal(reportType);
        Helper.sendSuccess(res, 200, profitTotal, "Profit total was fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function getTop5ProductsBySales(req, res) {
    try {
        const { reportType } = req.body;

        // Validate reportType
        const allowedReportTypes = ['week', 'month', 'year'];
        if (!allowedReportTypes.includes(reportType)) {
            return Helper.sendFail(res, 400, "Invalid report type. Allowed values are 'week', 'month', 'year'.");
        }

        const topProducts = await AccountingRepository.getTop5ProductsBySales(reportType);
        Helper.sendSuccess(res, 200, topProducts, "Top 5 products by sales were fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

const ReportController = {
    getStockIn,
    getStockOut,
    getProfit,
    getTop5ProductsBySales
}

module.exports = ReportController;