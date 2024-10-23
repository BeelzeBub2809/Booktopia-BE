const db = require('../models');
const mongoose = require('mongoose');

const Product = db.Product;
const Accounting = db.Accounting;

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

async function StockOut({productId, quantity, orderId = null, discount = 0, price = 0, status = 'success'}) {
    const product = await Product.findById(mongoose.Types.ObjectId(productId));
    if (!product) {
        throw new Error('Product not found');
    }

    if (product.quantityInStock < quantity) {
        throw new Error('Not enough stock');
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

const AccountingRepository = {
    StockIn,
    StockOut
}

module.exports = AccountingRepository;