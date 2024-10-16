const mongoose = require('mongoose')
const CartRepository = require('../repositories/Cart.repository');

async function getCart(req, res){
  try {
    const carts = await CartRepository.findAll();
    res.send(carts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function updateCart(req, res){
  try {
    const cart = await CartRepository.updateById(req.params.id, req.body);
    if (!cart) {
      res.status(404).send({ message: "Cart not found" });
      return;
    }
    res.send({ message: "Cart was updated successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function deleteCart(req, res){
    try {
      const cart = await CartRepository.deleteById(req.params.id);
      if (!cart) {
        res.status(404).send({ message: "Cart not found" });
        return;
      }
      res.send({ message: "Cart was deleted successfully!" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

const CartController = {
  getCart,
  updateCart,
  deleteCart
};

module.exports = CartController;