const db = require('../models');
const mongoose = require('mongoose');
const ProductRepository = require('./Product.repository');
const CustomerRepository = require('./Customer.repository');

const Cart = db.Cart;
const CartDetail = db.CartDetail;

async function getCartById(cartId) {
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

async function deleteCart(cartId) {
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

async function getUserCart(userId) {
    try {
        const customer = await CustomerRepository.getCustomerByUserId(userId);
        const customerId = customer._id;
        const cart = await Cart.findOne({ customerId: customerId });
        if (!cart) {
            throw new Error('Cart not found');
        }

        const cartDetail = await CartDetail.find({ cartId: cart._id }).populate('productId');

        return {
            ...cart.toObject(),
            cartDetail: cartDetail
        };
    } catch (error) {
        throw new Error('Error fetching cart: ' + error.message);
    }
}

async function addProductToCart(userId, productId, quantity) {
    try {
        const customer = await CustomerRepository.getCustomerByUserId(userId);
        const customerId = customer._id;
        let cart = await Cart.findOne({ customerId: customerId });
        if (!cart) {
            //create new Cart if not exist
            cart = await Cart.create({ customerId: customerId });
        }

        //check if product already in cart
        let cartDetail = await CartDetail.findOne({
            cartId: cart._id,
            productId: productId
        });
        if (cartDetail) {
            cartDetail.amount += quantity;
            await cartDetail.save();
        } else {
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

async function updateCart(userId, productId, quantity) {
    try {
        const customer = await CustomerRepository.getCustomerByUserId(userId);
        const customerId = customer._id;
        let cart = await Cart.findOne({ customerId: customerId });
        if (!cart) {
            //create new Cart if not exist
            cart = await Cart.create({ customerId: customerId });
        }        
        if (quantity <= 0) {
            let cartDetail = await CartDetail.findOne({
                cartId: cart._id,
                productId: productId
            });
            //delete product from cart
            if (cartDetail) {
                await CartDetail.findByIdAndDelete(cartDetail._id);
            }
        } else {
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

const CartRepository = {
    getCartById,
    deleteCart,
    getUserCart,
    addProductToCart,
    updateCart
}

module.exports = CartRepository;