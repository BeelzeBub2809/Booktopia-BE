const mongoose = require('mongoose');

const cartDetailSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' },
  comboId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCombo' },
  amount: { type: Number },
  type: { type: String }, //combo or single
  price: { type: mongoose.Types.Decimal128 },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCart' }
},
{
  timestamps: true,
}
);

const DBCartDetail = mongoose.model('DBCartDetail', cartDetailSchema);
module.exports = DBCartDetail;
