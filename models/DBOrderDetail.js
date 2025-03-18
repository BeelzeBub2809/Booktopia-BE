const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' },
  comboId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCombo' },
  amount: { type: Number },
  price: { type: mongoose.Types.Decimal128 },
  discount: { type: Number },
  type: { type: String }, //combo or single
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBOrder' },
  createDate: { type: Date },
  finishDate: { type: Date }
},
{
  timestamps: true,
}
);

const DBOrderDetail = mongoose.model('DBOrderDetail', orderDetailSchema);
module.exports = DBOrderDetail;
