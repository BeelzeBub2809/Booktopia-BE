const CategoryRepository = require('../repositories/Category.repository');

async function createCategory(req, res){
    try{
        const category = await CategoryRepository.createCategory({
            name: req.body.name
        });
        res.send({ message: "Category was created successfully!" });
    }catch(err){
        res.status(500).send({message: err});
        return;
    }
}

async function getCategory(req, res){
  try {
    const categories = await CategoryRepository.getAllCategories();
    res.send(categories);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

async function getCategoryById(req, res){
  try {
    const category = await CategoryRepository.getCategoryById(req.params.id);
    if (!category) {
      res.status(404).send({ message: "Category not found" });
      return;
    }
    res.send(category);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

async function updateCategory(req, res){
  try {
    const category = await CategoryRepository.updateCategory(req.params.id, req.body);
    if (!category) {
      res.status(404).send({ message: "Category not found" });
      return;
    }
    res.send({ message: "Category was updated successfully!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

async function deleteCategory(req, res){
  try {
    const category = await CategoryRepository.deleteCategory(req.params.id);
    if (!category) {
      res.status(404).send({ message: "Category not found" });
      return;
    }
    res.send({ message: "Category was deleted successfully!" });
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