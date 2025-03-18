const db = require('../models');
const mongoose = require('mongoose');
const ProductRepository = require('./Product.repository');
const CustomerRepository = require('./Customer.repository');
const DBProduct = require('../models/DBProduct');
const DBCombo = require('../models/DBCombo');
const DiscountRepository = require('./Discount.repository');

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

        let cartDetail = await CartDetail.find({ cartId: cart._id }).lean();

        // Conditionally populate based on whether productId or comboId exists
        for (const detail of cartDetail) {
            if (detail.productId) {
                // Populate productId if it exists
                const product = await DBProduct.findById(detail.productId).lean();
                const discount = await DiscountRepository.getDiscountByProductId(product._id);
                detail.productId = { ...product, discount: discount.discount };
            } else if (detail.comboId) {
                // Populate comboId if it exists
                detail.comboId = await DBCombo.findById(detail.comboId).lean();
            }
        }

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


async function addComboToCart(userId, comboId, quantity) {
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
            comboId: comboId
        });
        if (cartDetail) {
            cartDetail.amount += quantity;
            await cartDetail.save();
        } else {
            await CartDetail.create({
                cartId: cart._id,
                comboId: comboId,
                amount: quantity
            });
        }

        //populate cart details
        const cartDetails = await CartDetail.find({ cartId: cart._id }).populate('comboId');
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
        const product = await ProductRepository.getProductById(productId);
        if (quantity > product.quantityInStock) {
            throw new Error(`Only ${product.quantityInStock} items in stock for this product`);
        }
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


async function updateComboToCart(userId, comboId, quantity) {
    try {
        const combo = await DBCombo.findById(comboId);
        if (quantity > combo.quantity) {
            throw new Error(`Only ${combo.quantity} items in stock for this product`);
        }
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
                comboId: comboId
            });
            //delete product from cart
            if (cartDetail) {
                await CartDetail.findByIdAndDelete(cartDetail._id);
            }
        } else {
            //check if product already in cart
            let cartDetail = await CartDetail.findOne({
                cartId: cart._id,
                comboId: comboId
            });
            if (cartDetail) {
                cartDetail.amount = quantity;
                await cartDetail.save();
            } else {
                await CartDetail.create({
                    cartId: cart._id,
                    comboId: comboId,
                    amount: quantity
                });
            }
        }

        //populate cart details
        const cartDetails = await CartDetail.find({ cartId: cart._id }).populate('comboId');
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
    updateCart,
    addComboToCart,
    updateComboToCart
}

module.exports = CartRepository;