const mongoose = require('mongoose');

const cartDetailSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' },
  amount: { type: Number },
  price: { type: mongoose.Types.Decimal128 },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCart' }
});

const DBCartDetail = mongoose.model('DBCartDetail', cartDetailSchema);
module.exports = DBCartDetail;
