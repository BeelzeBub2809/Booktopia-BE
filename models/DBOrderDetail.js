const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' },
  amount: { type: Number },
  price: { type: mongoose.Types.Decimal128 },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBOrder' },
  createDate: { type: Date },
  finishDate: { type: Date }
});

const DBOrderDetail = mongoose.model('DBOrderDetail', orderDetailSchema);
module.exports = DBOrderDetail;
