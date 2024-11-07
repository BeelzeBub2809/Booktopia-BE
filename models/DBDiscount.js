const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' },
  startDate: { type: Date },
  endDate: { type: Date },
  price: { type: Number },
  discount: { type: Number },
  minOrderPrice: { type: Number },
  maxOrderPrice: { type: Number }
},
{
  timestamps: true,
}
);

const DBDiscount = mongoose.model('DBDiscount', discountSchema);
module.exports = DBDiscount;
