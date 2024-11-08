const db = require('../models');
const mongoose = require('mongoose');

const Product = db.Product;
const Accounting = db.Accounting;

/**
 * create a new accounting record for stock in
 * When a product is added to the inventory, a stock in accounting record is created
 */
async function StockIn({productId, quantity, orderId = null, discount = 0, price = 0, status = 'success',productType='DBProduct'}) {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const accounting = await Accounting.create({
            type: 'StockIn',
            price: price,
            productId: product._id,
            discount: discount,
            orderId: orderId,
            amount: quantity,
            status: status,
            productType: productType
        });
        if (!accounting) {
            throw new Error('Error creating accounting');
        }

        return accounting;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * create a new accounting record for stock out
 * When a product is sold, a stock out accounting record is created
 */
async function StockOut({productId, quantity, orderId = null, discount = 0, price = 0, status = 'success',productType="DBProduct"}) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    if (product.quantityInStock < quantity) {
        return;
    }

    const accounting = await Accounting.create({
        type: 'StockOut',
        price: price,
        productId: product._id,
        discount: discount,
        amount: quantity,
        orderId: orderId,
        status: status,
        productType: productType
    });

    if (!accounting) {
        throw new Error('Error creating accounting');
    }

    return accounting;
}

async function getAccountingByOrderId(orderId) {
    try {
        const accounting = await Accounting.find({orderId: orderId});
        return accounting;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function cancelAccountingOrder(orderId) {
    try{
        const accounting = await Accounting.find({orderId: orderId});
        for (const record of accounting){
            record.status = 'cancelled';
            await record.save();

            const product = await Product.findById(record.productId);
            if (!product){
                throw new Error('Product not found');
            }
            product.quantityInStock += parseInt(record.amount);
            await product.save();
        }
        return accounting;
    }catch(err){
        throw new Error(err.message);
    }
}

/**
 * Get the total amount of money spent on stock in for the specified period
 * @param {string} reportType - The type of report ('month', 'week', 'year')
 */
async function getStockInTotal(reportType) {
    try {
        let startDate, endDate;
        const now = new Date();

        switch (reportType) {
            case 'week':
                const startOfWeek = now.getDate() - now.getDay();
                startDate = new Date(now.setDate(startOfWeek));
                endDate = new Date(now.setDate(startOfWeek + 6));
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case 'month':
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
        }

        const total = await Accounting.aggregate([
            {
                $match: {
                    type: 'StockIn',
                    status: 'success',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: { $multiply: ['$price', '$amount'] } }
                }
            }
        ]);

        return total.length > 0 ? total[0].totalAmount : 0;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Get the total amount of money earned from stock out for the specified period
 * @param {string} reportType - The type of report ('month', 'week', 'year')
 */
async function getStockOutTotal(reportType) {
    try {
        let startDate, endDate;
        const now = new Date();

        switch (reportType) {
            case 'week':
                const startOfWeek = now.getDate() - now.getDay();
                startDate = new Date(now.setDate(startOfWeek));
                endDate = new Date(now.setDate(startOfWeek + 6));
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case 'month':
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
        }

        const total = await Accounting.aggregate([
            {
                $match: {
                    type: 'StockOut',
                    status: 'success',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: { $multiply: ['$price', '$amount'] } }
                }
            }
        ]);

        return total.length > 0 ? total[0].totalAmount : 0;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Get the total profit for the specified period
 * @param {string} reportType - The type of report ('month', 'week', 'year')
 */
async function getProfitTotal(reportType) {
    try {
        let startDate, endDate;
        const now = new Date();

        switch (reportType) {
            case 'week':
                const startOfWeek = now.getDate() - now.getDay();
                startDate = new Date(now.setDate(startOfWeek));
                endDate = new Date(now.setDate(startOfWeek + 6));
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case 'month':
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
        }

        const stockInTotal = await getStockInTotal(reportType);
        const stockOutTotal = await getStockOutTotal(reportType);

        const profit = stockOutTotal - stockInTotal;

        return profit;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Get the top 5 products with the highest sales for the specified period
 * @param {string} reportType - The type of report ('month', 'week', 'year')
 */
async function getTop5ProductsBySales(reportType) {
    try {
        let startDate, endDate;
        const now = new Date();

        switch (reportType) {
            case 'week':
                const startOfWeek = now.getDate() - now.getDay();
                startDate = new Date(now.setDate(startOfWeek));
                endDate = new Date(now.setDate(startOfWeek + 6));
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case 'month':
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
        }

        const topProducts = await Accounting.aggregate([
            {
                $match: {
                    type: 'StockOut',
                    status: 'success',
                    createdAt: { $gte: startDate, $lte: endDate } // Ensure the correct date field is used
                }
            },
            {
                $group: {
                    _id: { productId: '$productId', productType: '$productType' },
                    totalSales: { $sum: '$amount' }
                }
            },
            {
                $sort: { totalSales: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'dbproducts',
                    localField: '_id.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $lookup: {
                    from: 'dbcombos',
                    localField: '_id.productId',
                    foreignField: '_id',
                    as: 'combo'
                }
            },
            {
                $addFields: {
                    product: { $arrayElemAt: ['$product', 0] },
                    combo: { $arrayElemAt: ['$combo', 0] }
                }
            },
            {
                $project: {
                    _id: 0,
                    // productId: '$_id.productId',
                    product: {
                        $cond: {
                            if: { $eq: ['$_id.productType', 'DBProduct'] },
                            then: '$product',
                            else: '$combo'
                        }
                    },
                    totalSales: 1
                }
            }
        ]);

        return topProducts;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateAccountingStatusByOrderId(orderId, status) {
    try {
        const accountingRecords = await Accounting.updateMany(
            { orderId: orderId },
            { $set: { status: status } }
        );
        return accountingRecords;
    } catch (err) {
        throw new Error(err.message);
    }
}

const AccountingRepository = {
    StockIn,
    StockOut,
    getAccountingByOrderId,
    cancelAccountingOrder,
    getStockInTotal,
    getStockOutTotal,
    getProfitTotal,
    getTop5ProductsBySales,
    updateAccountingStatusByOrderId
}

module.exports = AccountingRepository;