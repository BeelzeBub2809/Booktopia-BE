const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCustomer' },
  createDate: { type: Date, default: Date.now },
  finishDate: { type: Date },
  status: { type: String },
  totalPrice: { type: mongoose.Types.Decimal128 },
  discount: { type: mongoose.Types.Decimal128 },
  delivery_code: { type: String },
  orderDetailId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DBOrderDetail' }]
});

const DBOrder = mongoose.model('DBOrder', orderSchema);
module.exports = DBOrder;
