const mongoose = require('mongoose')
const ProductRepository = require('../repositories/Product.repository');
const Helper = require('../helper/helper');
const { uploadImage } = require('../extensions/uploadImage');
const ComboRepository = require('../repositories/Combo.repository');
const DiscountRepository = require('../repositories/Discount.repository');
const CategoryRepository = require('../repositories/Category.repository');

async function createProduct(req, res) {
  const { name, images: base64Image } = req.body;

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
    const combos = await ComboRepository.getAvailableAllCombos();

    //merge products and combos
    const response = await Promise.all([
      ...products.map(async (product) => {
        const discount = product.discountId
          ? await DiscountRepository.getDiscountById(product.discountId)
          : null;

        const category = await Promise.all(
          product.categoryId.map(async (categoryId) => {
            return await CategoryRepository.getCategoryById(categoryId);
          })
        );

        return {
          _id: product._id,
          isbn: product.isbn,
          name: product.name,
          price: product.price,
          discount: discount,
          quantityInStock: product.quantityInStock,
          publisher: product.publisher,
          author: product.author,
          sold: product.sold,
          category: category,
          description: product.description,
          releaseDate: product.releaseDate,
          translator: product.translator,
          status: product.status,
          image: product.image,
          type: 'single',
        };
      }),
      ...combos.map(async (combo) => {
        let comboCategory = [];

        const products = await Promise.all(
          combo.productId.map(async (productId) => {
            const product = await ProductRepository.getProductById(productId);
            const discount = product.discountId
              ? await DiscountRepository.getDiscountById(product.discountId)
              : null;

            const category = await Promise.all(
              product.categoryId.map(async (categoryId) => {
                return await CategoryRepository.getCategoryById(categoryId);
              })
            );

            comboCategory.push(...category.filter(cat => !comboCategory.some(existingCat => existingCat._id.equals(cat._id))));

            return {
              _id: product._id,
              isbn: product.isbn,
              name: product.name,
              price: product.price,
              discount: discount,
              quantityInStock: product.quantityInStock,
              publisher: product.publisher,
              author: product.author,
              sold: product.sold,
              category: category,
              description: product.description,
              releaseDate: product.releaseDate,
              translator: product.translator,
              status: product.status,
              image: product.image,
              type: 'single',
            };
          })
        );

        return {
          _id: combo._id,
          name: combo.name,
          products: products,
          category: comboCategory,
          price: combo.price,
          discount: combo.discount,
          quantityInStock: combo.quantity,
          status: combo.status,
          image: combo.image,
          type: 'combo',
        };
      }),
    ]);

    Helper.sendSuccess(res, 200, response, "Products were fetched successfully!");
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

    const products = await ProductRepository.getAllProducts();
    const combos = await ComboRepository.getAvailableAllCombos();

    // Merge products and combos
    const response = await Promise.all([
      ...products.map(async (product) => {
        const discount = product.discountId
          ? await DiscountRepository.getDiscountById(product.discountId)
          : null;

        const category = await Promise.all(
          product.categoryId.map(async (categoryId) => {
            return await CategoryRepository.getCategoryById(categoryId);
          })
        );

        return {
          _id: product._id,
          isbn: product.isbn,
          name: product.name,
          price: product.price,
          discount: discount,
          quantityInStock: product.quantityInStock,
          publisher: product.publisher,
          author: product.author,
          sold: product.sold,
          category: category,
          description: product.description,
          releaseDate: product.releaseDate,
          translator: product.translator,
          status: product.status,
          image: product.image,
          type: 'single',
        };
      }),
      ...combos.map(async (combo) => {
        let comboCategory = [];

        const comboProducts = await Promise.all(
          combo.productId.map(async (productId) => {
            const product = await ProductRepository.getProductById(productId);
            const discount = product.discountId
              ? await DiscountRepository.getDiscountById(product.discountId)
              : null;

            const category = await Promise.all(
              product.categoryId.map(async (categoryId) => {
                return await CategoryRepository.getCategoryById(categoryId);
              })
            );

            comboCategory.push(...category.filter(cat => !comboCategory.some(existingCat => existingCat._id.equals(cat._id))));

            return {
              _id: product._id,
              isbn: product.isbn,
              name: product.name,
              price: product.price,
              discount: discount,
              quantityInStock: product.quantityInStock,
              publisher: product.publisher,
              author: product.author,
              sold: product.sold,
              category: category,
              description: product.description,
              releaseDate: product.releaseDate,
              translator: product.translator,
              status: product.status,
              image: product.image,
              type: 'single',
            };
          })
        );

        return {
          _id: combo._id,
          name: combo.name,
          products: comboProducts,
          category: comboCategory,
          price: combo.price,
          discount: combo.discount,
          quantityInStock: combo.quantity,
          status: combo.status,
          image: combo.image,
          type: 'combo',
        };
      }),
    ]);

    // Filter response by product name
    const filteredResponse = response.filter(item => 
      (item.type === 'single' && item.name.toLowerCase().includes(name.toLowerCase())) ||
      (item.type === 'combo' && item.name.toLowerCase().includes(name.toLowerCase()))
    );

    if (filteredResponse.length === 0) {
      Helper.sendFail(res, 404, "No products found");
      return;
    }

    Helper.sendSuccess(res, 200, filteredResponse, "Products were fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}


async function addProductToStorage(req, res){
  try {
    const oldProduct = await ProductRepository.getProductById(req.params.id);
    const product = await ProductRepository.updateProduct(req.params.id,
      { 
        quantityInStock: oldProduct.quantityInStock + parseInt(req.body.quantityInStock)
      });
    Helper.sendSuccess(res, 200, product, "Product was added to storage successfully!");
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
  getProductByName,
  addProductToStorage
};

module.exports = ProductController;