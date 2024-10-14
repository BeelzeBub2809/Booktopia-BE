const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const DBCategory = mongoose.model('DBCategory', categorySchema);
module.exports = DBCategory;
