const db = require('../models');
const mongoose = require('mongoose');

const Cart = db.Cart;

class CartRepository {
    async createCart(cartData) {
        try {
            const cart = await Cart.create(cartData);
            return cart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

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

    async updateCart(cartId, updateData) {
        try {
            const cart = await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw new Error('Error updating cart: ' + error.message);
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
}

module.exports = new CartRepository();