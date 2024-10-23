const mongoose = require('mongoose');
const {Combo} = require('../models');

    async function create(comboData) {
        const combo = new Combo(comboData);
        return await combo.save();
    }

    async function findById(comboId) {
        return await Combo.findById(comboId);
    }

    async function findAll() {
        return await Combo.find();
    }

    async function update(comboId, comboData) {
        return await Combo.findByIdAndUpdate(comboId, comboData, { new: true });
    }

    async function deleteCombo(comboId) {
        return await Combo.findByIdAndDelete(comboId);
    }

    const ComboRepository = {
        create,
        findById,
        findAll,
        update,
        deleteCombo
    }

module.exports = ComboRepository;