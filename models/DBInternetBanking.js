const mongoose = require('mongoose');

const internetBankingSchema = new mongoose.Schema({
  bank: { type: String },
  bankAccountNumber: { type: String },
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'DBCustomer' }
});

const DBInternetBanking = mongoose.model('DBInternetBanking', internetBankingSchema);
module.exports = DBInternetBanking;
