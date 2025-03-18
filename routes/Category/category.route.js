const express = require('express');
const {CategoryController} = require('../../controllers');
const AuthMiddlewares = require('../../middlewares/auth.middleware');

const router = express.Router();

// Route to get all categories
router.get('/', CategoryController.getCategory);

// Route to get a single category by ID
router.get('/:id', CategoryController.getCategoryById);

// Route to create a new category
router.post('/', AuthMiddlewares.verifyUser, CategoryController.createCategory);

// Route to update an existing category by ID
router.put('/:id', CategoryController.updateCategory);

// Route to delete a category by ID
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;