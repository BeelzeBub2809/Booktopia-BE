const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCustomer' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBProduct' },
  content: { type: String },
  rating: { type: Number },
  status: { type: String, default: 'active' },
},
{
  timestamps: true,
}
);

const DBReview = mongoose.model('DBReview', reviewSchema);
module.exports = DBReview;
