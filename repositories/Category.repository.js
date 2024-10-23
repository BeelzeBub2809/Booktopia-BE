const { Category } = require('../models');

async function getAllCategories() {
    try {
        return await Category.find();
    } catch (error) {
        throw new Error('Error fetching categories: ' + error.message);
    }
}

async function getCategoryById(categoryId) {
    try {
        return await Category.findById(categoryId);
    } catch (error) {
        throw new Error('Error fetching category: ' + error.message);
    }
}

async function createCategory(categoryData) {
    try {
        console.log(categoryData);
        return await Category.create(categoryData);
    } catch (error) {
        throw new Error('Error creating category: ' + error.message);
    }
}

async function updateCategory(categoryId, categoryData) {
    try {
        return await Category.findByIdAndUpdate(categoryId, categoryData);
    } catch (error) {
        throw new Error('Error updating category: ' + error.message);
    }
}

async function deleteCategory(categoryId) {
    try {
        return await Category.findByIdAndDelete(categoryId);
    } catch (error) {
        throw new Error('Error deleting category: ' + error.message);
    }
}

const CategoryRepository = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}

module.exports = CategoryRepository;