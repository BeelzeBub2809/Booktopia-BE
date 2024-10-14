const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
  productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' }],
  price: { type: mongoose.Types.Decimal128 },
  discount: { type: mongoose.Types.Decimal128 }
});

const DBCombo = mongoose.model('DBCombo', comboSchema);
module.exports = DBCombo;
