const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBUser' },
  internetBankingId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DBInternetBanking' }],
  shipAddress: [{ type: String }]
});

const DBCustomer = mongoose.model('DBCustomer', customerSchema);
module.exports = DBCustomer;
