const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  refundDate: { type: Date, default: Date.now },
  reason: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBOrder', required: true },
  status: { type: String },
  image: { type: String }
},
{
  timestamps: true,
}
);

const DBRefund = mongoose.model('DBRefund', refundSchema);
module.exports = DBRefund;
