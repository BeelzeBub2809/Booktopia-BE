const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  isbn: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true},
  discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBDiscount' },
  quantityInStock: { type: Number },
  publisher: { type: String },
  author: [{ type: String }],
  sold: { type: Number },
  categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DBCategory' }],
  description: { type: String },
  releaseDate: { type: Date },
  translator: [{ type: String }],
  image: [{ type: String }],
  status: { type: String }
},
{
  timestamps: true,
}
);

const DBProduct = mongoose.model('DBProduct', productSchema);
module.exports = DBProduct;
