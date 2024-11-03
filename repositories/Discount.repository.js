const { Discount } = require('../models');
const mongoose = require('mongoose');

async function getAllDiscounts() {
    try {
        return await Discount.find().populate('productId');
    } catch (error) {
        throw new Error('Error fetching discounts: ' + error.message);
    }
}

async function getDiscountById(discountId) {
    try {
        const discount = await Discount.findById(discountId);
        if (!discount) {
            throw new Error('Discount not found');
        }
        return discount;
    } catch (error) {
        throw new Error('Error fetching discount: ' + error.message);
    }
}


async function createDiscount(discountData) {
    try {
        return await Discount.create(discountData);
    } catch (error) {
        throw new Error('Error creating discount: ' + error.message);
    }
}

async function updateDiscount(discountId, updateData) {
    try {
        const discount = await Discount.findByIdAndUpdate(discountId, updateData, { new: true });
        if (!discount) {
            throw new Error('Discount not found');
        }
        return discount;
    } catch (error) {
        throw new Error('Error updating discount: ' + error.message);
    }
}

async function deleteDiscount(discountId) {
    try {
        const discount = await Discount.findByIdAndDelete(discountId);
        if (!discount) {
            throw new Error('Discount not found');
        }
        return discount;
    } catch (error) {
        throw new Error('Error deleting discount: ' + error.message);
    }
}


const DiscountRepository = {
    getDiscountById,
    getAllDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
};

module.exports = DiscountRepository;