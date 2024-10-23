const db = require('../models');
const mongoose = require('mongoose');
const ProductRepository = require('./Product.repository');

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

            const cartDetail = await CartDetail.find({ cart: cart._id }).populate('product');

            return {
                ...cart.toObject(),
                cartDetail: cartDetail
            };
        } catch (error) {
            throw new Error('Error fetching cart: ' + error.message);
        }
    }

    async addProductToCart(userId, productId, quantity) {
        try {
            //check if product exist
            let cart = await Cart.findOne({ customerId: userId });
            if (!cart) {
                //create new Cart if not exist
                cart = await Cart.create({ customerId: userId });
            }

            //check if product already in cart
            let cartDetail = await CartDetail.findOne({
                cartId: cart._id,
                productId: productId
            });
            if(cartDetail){
                cartDetail.amount += quantity;
                await cartDetail.save();
            }else{
                await CartDetail.create({
                    cartId: cart._id,
                    productId: productId,
                    amount: quantity
                });
            }

            //populate cart details
            const cartDetails = await CartDetail.find({ cartId: cart._id }).populate('productId');
            return {
                ...cart.toObject(),
                cartDetails: cartDetails
            };
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async updateCart(userId,productId, quantity) {
        try {
            //check if product exist
            let cart = await Cart.findOne({ customerId: userId });
            if (!cart) {
                //create new Cart if not exist
                cart = await Cart.create({ customerId: userId });
            }

            if(quantity <= 0){
                let cartDetail = await CartDetail.findOne({
                    cartId: cart._id,
                    productId: productId
                });
                //delete product from cart
                if(cartDetail){
                    await CartDetail.findByIdAndDelete(cartDetail._id);
                }
            }else{
                //check if product already in cart
                let cartDetail = await CartDetail.findOne({
                    cartId: cart._id,
                    productId: productId
                });
                if (cartDetail) {
                    cartDetail.amount = quantity;
                    await cartDetail.save();
                } else {
                    await CartDetail.create({
                        cartId: cart._id,
                        productId: productId,
                        amount: quantity
                    });
                }
            }

            //populate cart details
            const cartDetails = await CartDetail.find({ cartId: cart._id }).populate('productId');
            return {
                ...cart.toObject(),
                cartDetails: cartDetails
            };
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }
}

module.exports = new CartRepository();