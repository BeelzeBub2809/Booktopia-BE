const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  DOB: { type: Date },
  fullName: { type: String },
  address: { type: String },
  email: { type: String },
  phone: { type: String },
  status: { type: String },
  gender: { type: String },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBRole' },
  image: { type: String }
},
{
  timestamps: true,
}
);

const DBUser = mongoose.model('DBUser', userSchema);
module.exports = DBUser;
