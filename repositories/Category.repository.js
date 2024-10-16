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
            console.log(categoryData);
            return await Category.create(categoryData);
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    }

    async updateCategory(categoryId, categoryData) {
        try {
            return await Category.findByIdAndUpdate (categoryId,categoryData);
        }catch(error){
            throw new Error('Error updating category: ' + error.message);
        }
    }

    async deleteCategory(categoryId) {
        try {
            return await Category.findByIdAndDelete(categoryId);
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    }
}

module.exports = new CategoryRepository();