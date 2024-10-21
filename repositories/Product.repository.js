const db = require('../models');
const mongoose = require('mongoose');

const Product = db.Product;

class ProductRepository {
    async getAllProducts() {
        try {
            return await Product.find();
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            throw new Error('Error fetching product: ' + error.message);
        }
    }

    async createProduct(productData) {
        try {
            if (!productData || Object.keys(productData).length === 0) {
                throw new Error('Invalid product data');
            }
            const newProduct = await Product.create(productData);
            if(newProduct.quantityInStock > 0){
                const accounting = await Accounting.create({
                    type: 'StockIn',
                    price: newProduct.price,
                    productId: [{
                        productId: newProduct._id,
                        amount: newProduct.quantityInStock
                    }],
                    status: 'success'
                });

                if(!accounting){
                    throw new Error('Error creating accounting');
                }
            }

            return newProduct;
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    }

    async updateProduct(productId, productData) {
        try {
            
            const oldProduct = await Product.findById(productId);

            const newProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
            if (!newProduct) {
                throw new Error('Product not found');
            }
            if((oldProduct.quantityInStock-newProduct.quantityInStock) > 0){
                const accounting = await Accounting.create({
                    type: 'StockIn',
                    price: newProduct.price,
                    productId: [{
                        productId: newProduct._id,
                        amount: newProduct.quantityInStock
                    }],
                    status: 'success'
                });

                if(!accounting){
                    throw new Error('Error creating accounting');
                }
            }else if((oldProduct.quantityInStock-newProduct.quantityInStock) < 0){
                const accounting = await Accounting.create({
                    type: 'StockOut',
                    price: newProduct.price,
                    productId: [{
                        productId: newProduct._id,
                        amount: newProduct.quantityInStock
                    }],
                    status: 'success'
                });

                if(!accounting){
                    throw new Error('Error creating accounting');
                }
            }
            return newProduct;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(productId) {
        try {
            return await Product.findByIdAndDelete(productId);
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }
}

module.exports = new ProductRepository();