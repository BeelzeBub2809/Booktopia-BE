const { Category } = require('../models');

class CategoryRepository {
   async getAllCategories() {
         try {
              return await Category.find();
         } catch (error) {
              throw new Error('Error fetching categories: ' + error.message);
         }
    }

    async getCategoryById(categoryId) {
        try {
            return await Category.findById(categoryId);
        } catch (error) {
            throw new Error('Error fetching category: ' + error.message);
        }
    }

    async createCategory(categoryData) {
        try {
            return await Category.create(categoryData);
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    }

    async updateCategory(categoryId, categoryData) {
        try {
            const category = await Category
                .findById(categoryId);
            if (!category) {
                throw new Error('Category not found');
            }
            return await category.update(categoryData);
        }catch(error){
            throw new Error('Error updating category: ' + error.message);
        }
    }
}

module.exports = new CategoryRepository();