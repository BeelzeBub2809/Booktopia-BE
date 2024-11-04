const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCustomer' },
  createDate: { type: Date, default: Date.now },
  finishDate: { type: Date },
  status: { type: String },
  totalPrice: { type: mongoose.Types.Decimal128 },
  discount: { type: mongoose.Types.Decimal128 },
  delivery_code: { type: String },
  note: { type: String },
  payment_type_id: { type: Number },
  receiver_name: { type: String },
  receiver_phone: { type: String },
  receiver_address: { type: String },
  receiver_ward_name: { type: String },
  receiver_district_name: { type: String },
  receiver_province_name: { type: String },
  shipping_fee: { type: mongoose.Types.Decimal128 },
},
{
  timestamps: true,
}
);

const DBOrder = mongoose.model('DBOrder', orderSchema);
module.exports = DBOrder;
