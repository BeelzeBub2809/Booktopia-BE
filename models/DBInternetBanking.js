const mongoose = require('mongoose');

const internetBankingSchema = new mongoose.Schema({
  bank: { type: String },
  bankAccountNumber: { type: String }
},
{
  timestamps: true,
}
);

const DBInternetBanking = mongoose.model('DBInternetBanking', internetBankingSchema);
module.exports = DBInternetBanking;
