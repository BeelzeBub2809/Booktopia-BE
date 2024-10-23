const mongoose = require('mongoose');
const {Combo} = require('../models');

class ComboRepository {
    async create(comboData) {
        const combo = new Combo(comboData);
        return await combo.save();
    }

    async findById(comboId) {
        return await Combo.findById(comboId);
    }

    async findAll() {
        return await Combo.find();
    }

    async update(comboId, comboData) {
        return await Combo.findByIdAndUpdate(comboId, comboData, { new: true });
    }

    async delete(comboId) {
        return await Combo.findByIdAndDelete(comboId);
    }
}

module.exports = new ComboRepository();