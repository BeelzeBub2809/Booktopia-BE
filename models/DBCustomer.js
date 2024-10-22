const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBUser' },
  shipAddress: [{ type: String }]
});

const DBCustomer = mongoose.model('DBCustomer', customerSchema);
module.exports = DBCustomer;
