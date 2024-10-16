const mongoose = require('mongoose')
const ProductRepository = require('../repositories/Product.repository');

async function createProduct(req, res){
    try{
        const product = await ProductRepository.createProduct(req.body);
        if(!product){
            res.status(500).send({message: "Error creating product!"});
            return;
        }
        res.send({ message: "Product was created successfully!" });
    }catch(err){
        res.status(500).send({message: err});
        return;
    }
}

async function getProduct(req, res){
  try {
    const products = await ProductRepository.getAllProducts();
    res.send(products);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

async function getProductById(req, res){
  try {
    const product = await ProductRepository.getProductById(req.params.id);
    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }
    res.send(product);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

async function updateProduct(req, res){
  try {
    console.log(req.body);
    const product = await ProductRepository.updateProduct(req.params.id, req.body);
    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }
    res.send({ message: "Product was updated successfully!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

async function deleteProduct(req, res){
  try {
    const product = await ProductRepository.deleteProduct(req.params.id);
    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }
    res.send({ message: "Product was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err });
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