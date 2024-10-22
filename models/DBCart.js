const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCustomer' },
});

const DBCart = mongoose.model('DBCart', cartSchema);
module.exports = DBCart;
