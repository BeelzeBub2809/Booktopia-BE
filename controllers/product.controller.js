const mongoose = require('mongoose')
const ProductRepository = require('../repositories/Product.repository');
const Helper = require('../helper/helper');
const { uploadImage } = require('../extensions/uploadImage');

async function createProduct(req, res) {
  const { name, image: base64Image } = req.body;

  try {
      const imageUrl = await uploadImage(base64Image, name, 'product');
      const product = await ProductRepository.createProduct({ ...req.body, image: imageUrl });

      if (!product) {
          Helper.sendFail(res, 500, "Error creating product");
          return;
      }
      Helper.sendSuccess(res, 200, product, "Product was created successfully!");
  } catch (error) {
      Helper.sendFail(res, 500, error.message);
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
    const { name, image: base64Image } = req.body;
    
    var updaptedProduct;
    if( !base64Image){
      delete req.body.image;
      updaptedProduct = await ProductRepository.updateProduct(req.params.id, req.body);
    } else {
      const isUploadedImage = await ProductRepository.checkExistImage(req.params.id, base64Image[0]);
      if(isUploadedImage){
        delete req.body.image;
        updaptedProduct = await ProductRepository.updateProduct(req.params.id, req.body);
      } else {
        base64Image = await uploadImage(base64Image[0], name, 'product');
        updaptedProduct = await ProductRepository.updateProduct(req.params.id, { ...req.body, image: base64Image });
      }
    }
    
    if(updaptedProduct){
      Helper.sendSuccess(res, 200, updaptedProduct, "Product was updated successfully!");
    }

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

async function getAllProductsBySales(req, res){
  try {
    const products = await ProductRepository.getAllProductsBySales();
    Helper.sendSuccess(res, 200, products, "Products were fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}
async function getProductByName(req, res) {
  try {
    const name = req.query.name; // Retrieve the search term from the query parameter
    if (!name) {
      Helper.sendFail(res, 400, "Search term is required");
      return;
    } 

    const products = await ProductRepository.getProductByName(name);
    if (products.length === 0) {
      Helper.sendFail(res, 404, "No products found");
      return;
    }

    Helper.sendSuccess(res, 200, products, "Products were fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}


const ProductController = {
  getProductById,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProductsBySales,
  getProductByName
};

module.exports = ProductController;