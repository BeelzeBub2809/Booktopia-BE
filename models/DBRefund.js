const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  refundDate: { type: Date },
  reason: { type: String },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBOrder' },
  status: { type: String },
  image: { type: String }
},
{
  timestamps: true,
}
);

const DBRefund = mongoose.model('DBRefund', refundSchema);
module.exports = DBRefund;
