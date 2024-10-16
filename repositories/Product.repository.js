const db = require('../models');
const mongoose = require('mongoose');

const Product = db.product;

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
            const newProduct = await Product.create(productData);
            return newProduct;
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    }

    async updateProduct(productId, productData) {
        try {
            return await Product.findByIdAndUpdate(productId, productData, { new: true });
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