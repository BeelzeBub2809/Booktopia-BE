const mongoose = require('mongoose');
const DiscountRepository = require('../repositories/Discount.repository');
const Helper = require('../helper/helper');

async function getAllDiscounts(req, res) {
  try {
    const discounts = await DiscountRepository.getAllDiscounts();
    Helper.sendSuccess(res, 200, discounts, "Discounts were fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function getDiscountById(req, res) {
  try {
    const discount = await DiscountRepository.getDiscountById(req.params.id);
    if (!discount) {
      Helper.sendFail(res, 404, "Discount not found");
      return;
    }
    Helper.sendSuccess(res, 200, discount, "Discount was fetched successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function createDiscount(req, res) {
  try {
    const discount = await DiscountRepository.createDiscount(req.body);
    Helper.sendSuccess(res, 201, discount, "Discount was created successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function updateDiscount(req, res) {
  try {
    const discount = await DiscountRepository.updateDiscount(req.params.id, req.body);
    if (!discount) {
      Helper.sendFail(res, 404, "Discount not found");
      return;
    }
    Helper.sendSuccess(res, 200, discount, "Discount was updated successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

async function deleteDiscount(req, res) {
  try {
    const discount = await DiscountRepository.deleteDiscount(req.params.id);
    if (!discount) {
      Helper.sendFail(res, 404, "Discount not found");
      return;
    }
    Helper.sendSuccess(res, 200, discount, "Discount was deleted successfully!");
  } catch (err) {
    Helper.sendFail(res, 500, err.message);
  }
}

const DiscountController = {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount
};

module.exports = DiscountController;