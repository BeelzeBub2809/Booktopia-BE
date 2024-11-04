const mongoose = require('mongoose');
const ComboRepository = require('../repositories/Combo.repository');
const Helper = require('../helper/helper');

async function createCombo(req, res) {
    try {
        const combo = await ComboRepository.create({
            name: req.body.name,    
            productId: req.body.productId,
            price: req.body.price,
            discount: req.body.discount,
            status: req.body.status,
            quantity: req.body.quantity
        });
        Helper.sendSuccess(res, 200, combo, "Combo was created successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function getCombo(req, res) {
    try {
        const combos = await ComboRepository.findAll();
        Helper.sendSuccess(res, 200, combos, "Combos were fetched successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

async function getComboById(req, res) {
    try {
        const combo = await ComboRepository.findById(req.params.id);
        if (!combo) {
            Helper.sendFail(res, 404, "Combo not found");
            return;
        }
        Helper.sendSuccess(res, 200, combo, "Combo was fetched successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

async function updateCombo(req, res) {
    try {
        const combo = await ComboRepository.update(req.params.id, {
            name: req.body.name,
            productId: req.body.productId,
            price: req.body.price,
            discount: req.body.discount,
            status: req.body.status,
            quantity: req.body.quantity
        });
        Helper.sendSuccess(res, 200, combo, "Combo was updated successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

async function deleteCombo(req, res) {
    try {
        const combo = await ComboRepository.deleteCombo(req.params.id);
        Helper.sendSuccess(res, 200, combo, "Combo was deleted successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

const ComboController = {
    createCombo,
    getCombo,
    getComboById,
    updateCombo,
    deleteCombo
}

module.exports = ComboController;