const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
  name: { type: String },
  productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' }],
  price: { type: mongoose.Types.Decimal128 },
  discount: { type: mongoose.Types.Decimal128 },
  status: { type: String },
},
{
  timestamps: true,
}
);

const DBCombo = mongoose.model('DBCombo', comboSchema);
module.exports = DBCombo;
