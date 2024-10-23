const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCustomer' },
},
{
  timestamps: true,
}
);

const DBCart = mongoose.model('DBCart', cartSchema);
module.exports = DBCart;
