const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'DBUser' },
  content: { type: String },
  title: { type: String },
  link: { type: String },
  createDate: { type: Date }
},
{
  timestamps: true,
}
);

const DBNotification = mongoose.model('DBNotification', notificationSchema);
module.exports = DBNotification;
