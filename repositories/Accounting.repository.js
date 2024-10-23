const db = require('../models');
const mongoose = require('mongoose');
const ProductRepository = require('./Product.repository');

const Accounting = db.Accounting;

class AccountingRepository{
    async StockIn(productId, quantity, orderId = null, discount = 0,price = 0,status = 'success'){
        try{
            const product = await ProductRepository.getProductById(productId);
            if(!product){
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
    
            if(!accounting){
                throw new Error('Error creating accounting');
            }
    
            return accounting;
        }catch(err){
            throw new Error(err.message);
        }
    }

    async StockOut(productId, quantity, orderId = null, discount = 0, price = 0, status = 'success'){
        const product = await ProductRepository.getProductById(productId);
        if(!product){
            throw new Error('Product not found');
        }

        if(product.quantityInStock < quantity){
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

        if(!accounting){
            throw new Error('Error creating accounting');
        }

        return accounting;
    }
}

module.exports = new AccountingRepository();