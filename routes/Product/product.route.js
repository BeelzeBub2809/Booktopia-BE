const express = require('express');
const {ProductController} = require('../../controllers');

const productRoute = express.Router();

productRoute.get('/', ProductController.getProduct);
productRoute.get('/:id', ProductController.getProductById);
productRoute.post('/', ProductController.createProduct);
productRoute.put('/:id', ProductController.updateProduct);
productRoute.delete('/:id', ProductController.deleteProduct);

module.exports = productRoute;