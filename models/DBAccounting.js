const mongoose = require('mongoose');

const accountingSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String },
  price: { type: mongoose.Types.Decimal128 },
  discount: { type: mongoose.Types.Decimal128 },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBOrder' },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'productType', 
    default: 'DBProduct' 
  },
  productType: { 
    type: String, 
    enum: ['DBProduct', 'DBCombo'], 
    default: 'DBProduct' 
  },
  amount: { type: mongoose.Types.Decimal128 },
  status: { type: String },  // success, pending, failed
},
{
  timestamps: true, // This will automatically add createdAt and updatedAt fields
});

const DBAccounting = mongoose.model('DBAccounting', accountingSchema);
module.exports = DBAccounting;
