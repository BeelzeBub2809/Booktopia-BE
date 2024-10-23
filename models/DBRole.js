const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role: { type: String, required: true }
},
{
  timestamps: true,
}
);

const DBRole = mongoose.model('DBRole', roleSchema);
module.exports = DBRole;
