const db = require('../models');
const mongoose = require('mongoose');
const AccountingRepository = require('./Accounting.repository');
const { uploadImage, deleteImages } = require('../extensions/uploadImage');

const Product = db.Product;
const Accounting = db.Accounting;

async function getAllProducts() {
    try {
        return await Product.find();
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }

    
}

async function getProductById(productId) {
    try {
        return await Product.findById(productId);
    } catch (error) {
        throw new Error('Error fetching product: ' + error.message);
    }
}

async function createProduct(productData) {
    try {
        const imageUrl = await uploadImage(productData.image, productData.name, 'product');

        if (!productData || Object.keys(productData).length === 0) {
            throw new Error('Invalid product data');
        }
        const newProduct = await Product.create({...productData, image: imageUrl});
        if (newProduct.quantityInStock > 0) {
            const accounting = await AccountingRepository.StockIn(
                {
                    productId: newProduct._id,
                    quantity: newProduct.quantityInStock
                }
            );
            
            if (!accounting) {
                throw new Error('Error creating accounting');
            }
        }

        return newProduct;
    } catch (error) {
        throw new Error('Error creating product: ' + error.message);
    }
}

async function updateProduct(productId, productData) {
    try {
        const oldProduct = await Product.findById(productId);
        if (!oldProduct) {
            throw new Error('Product not found');
        }

        if(productData.image) {
            await deleteImages(oldProduct.image, productData.image);
            productData.image = await uploadImage(productData.image, productData.name, 'product');
        }
        
        const newProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
        if ((oldProduct.quantityInStock - newProduct.quantityInStock) > 0) {
            const accounting = await AccountingRepository.StockOut({
                productId: newProduct._id,
                quantity: oldProduct.quantityInStock - newProduct.quantityInStock
            }
            );

            if (!accounting) {
                throw new Error('Error creating accounting');
            }
        } else if ((oldProduct.quantityInStock - newProduct.quantityInStock) < 0) {
            const accounting = await AccountingRepository.StockIn({
                productId: newProduct._id,
                quantity: newProduct.quantityInStock - oldProduct.quantityInStock
            }
            );

            if (!accounting) {
                throw new Error('Error creating accounting');
            }
        }

        return newProduct;
    } catch (error) {
        throw new Error('Error updating product: ' + error.message);
    }
}

async function deleteProduct(productId) {
    try {
        return await Product.findByIdAndDelete(productId);
    } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
    }
}

async function getAllProductsBySales(query) {
    try {
        return await Product.find(query).populate('categoryId');
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
}
async function getProductByName(name) {
    try {
        return await Product.find({ name: new RegExp(name, 'i') }); 
    } catch (error) {
        throw new Error('Error fetching products by name: ' + error.message);
    }
}

async function checkExistImage(productId, image) {
    const product = await Product.findById(productId);
    if (!product || !product.image || !Array.isArray(product.image) || product.image.length === 0) {
        return false;
    }

    if (product.image[0] === image) {
        return true;
    }
    return false;
}

const ProductRepository = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsBySales,
    getProductByName,
    checkExistImage
}

module.exports = ProductRepository;