const express = require('express');
const {ProductController} = require('../../controllers');
const AuthMiddlewares = require('../../middlewares/auth.middleware');
const Extension = require('../../extensions/uploadImage');

const productRoute = express.Router();

productRoute.get('/search', ProductController.getProductByName);
productRoute.get('/', ProductController.getProduct);
productRoute.get('/:id', ProductController.getProductById);
productRoute.post('/', [Extension.upload.array('images', 5)],ProductController.createProduct);
productRoute.put('/:id', ProductController.updateProduct);
productRoute.delete('/:id', ProductController.deleteProduct);
productRoute.post('/all', ProductController.getAllProductsBySales);
productRoute.put('/:id/add-to-storage',ProductController.addProductToStorage);

module.exports = productRoute;