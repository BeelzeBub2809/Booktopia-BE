const db = require('../models');
const mongoose = require('mongoose');

const Cart = db.Cart;
const CartDetail = db.CartDetail;

class CartRepository {
    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw new Error('Error fetching cart: ' + error.message);
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await Cart.findByIdAndDelete(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw new Error('Error deleting cart: ' + error.message);
        }
    }

    async getUserCart(userId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw new Error('Error fetching cart: ' + error.message);
        }
    }

    async addProductToCart(userId, productId, quantity) {
        try {
            let cart = await Cart.findOne({ customerId: userId });
            if (!cart) {
                //create new Cart if not exist
                cart = await Cart.create({ customerId: userId });
            }
            let cartDetail = await CartDetail.findOne({
                cart: cart._id,
                product: productId
            });

            if(cartDetail){
                cartDetail.amount += quantity;
                await cartDetail.save();
            }else{
                await CartDetail.create({
                    cart: cart._id,
                    productId: productId,
                    amount: quantity
                });
            }

            const cartDetails = await CartDetail.find({ cart: cart._id });
            return {
                ...cart,
                cartDetails: cartDetails
            };
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }
}

module.exports = new CartRepository();