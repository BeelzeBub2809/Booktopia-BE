const Helper = require('../helper/helper');
const CategoryRepository = require('../repositories/Category.repository');

async function createCategory(req, res){
    try{
        const category = await CategoryRepository.createCategory({
            name: req.body.name
        });
        Helper.sendSuccess(res, 200, category, "Category was created successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
        return;
    }
}

async function getCategory(req, res){
  try {
    const categories = await CategoryRepository.getAllCategories();
    Helper.sendSuccess(res, 200, categories, "Categories were fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function getCategoryById(req, res){
  try {
    const category = await CategoryRepository.getCategoryById(req.params.id);
    if (!category) {
      Helper.sendFail(res, 404, "Category not found");
      return;
    }
    Helper.sendSuccess(res, 200, category, "Category was fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function updateCategory(req, res){
  try {
    const category = await CategoryRepository.updateCategory(req.params.id, req.body);
    if (!category) {
      Helper.sendFail(res, 404, "Category not found");
      return;
    }
    Helper.sendSuccess(res, 200, category, "Category was updated successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);}
}

async function deleteCategory(req, res){
  try {
    const category = await CategoryRepository.deleteCategory(req.params.id);
    if (!category) {
      Helper.sendFail(res, 404, "Category not found");
      return;
    }
    Helper.sendSuccess(res, 200, category, "Category was deleted successfully!");
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

const CategoryController = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
};

module.exports = CategoryController;