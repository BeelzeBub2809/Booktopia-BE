const mongoose = require('mongoose');

const accountingSchema = new mongoose.Schema({
  date: { type: Date },
  type: { type: String },
  amount: { type: mongoose.Types.Decimal128 },
  price: { type: mongoose.Types.Decimal128 },
  discount: { type: mongoose.Types.Decimal128 },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBOrder' },
  productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' }],
  status: { type: String }
});

const DBAccounting = mongoose.model('DBAccounting', accountingSchema);
module.exports = DBAccounting;
