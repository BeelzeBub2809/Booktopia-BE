const db = require('../models');
const mongoose = require('mongoose');

const Product = db.Product;
const Accounting = db.Accounting;

/**
 * create a new accounting record for stock in
 * When a product is added to the inventory, a stock in accounting record is created
 */
async function StockIn({productId, quantity, orderId = null, discount = 0, price = 0, status = 'success'}) {
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
            status: status
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
async function StockOut({productId, quantity, orderId = null, discount = 0, price = 0, status = 'success'}) {
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
        status: status
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

const AccountingRepository = {
    StockIn,
    StockOut,
    getAccountingByOrderId,
    cancelAccountingOrder
}

module.exports = AccountingRepository;