const mongoose = require('mongoose')
const CartRepository = require('../repositories/Cart.repository');
const Helper = require('../helper/helper');

async function getCart(req, res){
  try {
    const cart = await CartRepository.getUserCart(req.params.userId);
    if (!cart) {
      Helper.sendFail(res, 404, "Cart not found");
      return;
    }
    Helper.sendSuccess(res, 200, cart, "Cart was fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function updateCart(req, res){
  try {
    let cart
    if (req.body.productId) {
        cart = await CartRepository.updateCart(
        req.params.userId,
        req.body.productId,
        req.body.quantity
      );
    } else {
      cart = await CartRepository.updateComboToCart(
        req.params.userId,
        req.body.comboId,
        req.body.quantity
      );
    }
    if (!cart) {
      Helper.sendFail(res, 404, "Cart not found");
      return;
    }
    Helper.sendSuccess(res, 200, cart, "Cart was updated successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function deleteCart(req, res){
  try {
    const cart = await CartRepository.deleteById(req.params.id);
    if (!cart) {
      Helper.sendFail(res, 404, "Cart not found");
      return;
    }
    Helper.sendSuccess(res, 200, cart, "Cart was deleted successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function addProductToCart(req, res){
  try {
    const cart = await CartRepository.addProductToCart(req.params.userId, req.body.productId, req.body.quantity);
    Helper.sendSuccess(res, 200, cart, "Product was added to cart successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function addComboToCart(req, res){
  try {
    const cart = await CartRepository.addComboToCart(req.params.userId, req.body.comboId, req.body.quantity);
    Helper.sendSuccess(res, 200, cart, "Combo was added to cart successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

const CartController = {
  getCart,
  updateCart,
  deleteCart,
  addProductToCart,
  addComboToCart
};

module.exports = CartController;
