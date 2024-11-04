const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
  name: { type: String },
  productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' }],
  price: { type: Number, required: true },
  discount: { type: Number},
  quantity: { type: Number },
  status: { type: String },
  image: [{ type: String }],
},
{
  timestamps: true,
}
);

const DBCombo = mongoose.model('DBCombo', comboSchema);
module.exports = DBCombo;
