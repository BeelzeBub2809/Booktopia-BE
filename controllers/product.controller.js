const mongoose = require('mongoose')
const ProductRepository = require('../repositories/Product.repository');
const Helper = require('../helper/helper');

async function createProduct(req, res){
    try{
        const product = await ProductRepository.createProduct(req.body);
        if(!product){
            Helper.sendFail(res, 500, "Error creating product");
            return;
        }
        Helper.sendSuccess(res, 200, product, "Product was created successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
        return;
    }
}

async function getProduct(req, res){
  try {
    const products = await ProductRepository.getAllProducts();
    Helper.sendSuccess(res, 200, products, "Products were fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function getProductById(req, res){
  try {
    const product = await ProductRepository.getProductById(req.params.id);
    if (!product) {
      Helper.sendFail(res, 404, "Product not found");
      return;
    }
    Helper.sendSuccess(res, 200, product, "Product was fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function updateProduct(req, res){
  try {
    const product = await ProductRepository.updateProduct(req.params.id, req.body);
    Helper.sendSuccess(res, 200, product, "Product was updated successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function deleteProduct(req, res){
  try {
    const product = await ProductRepository.deleteProduct(req.params.id);
    Helper.sendSuccess(res, 200, {}, "Product was deleted successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

const ProductController = {
  getProductById,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
};

module.exports = ProductController;