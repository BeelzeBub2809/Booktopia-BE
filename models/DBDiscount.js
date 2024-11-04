const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' },
  startDate: { type: Date },
  endDate: { type: Date },
  discount: { type: mongoose.Types.Decimal128 },
  minOrderPrice: { type: mongoose.Types.Decimal128 },
  maxOrderPrice: { type: mongoose.Types.Decimal128 }
},
{
  timestamps: true,
}
);

const DBDiscount = mongoose.model('DBDiscount', discountSchema);
module.exports = DBDiscount;
