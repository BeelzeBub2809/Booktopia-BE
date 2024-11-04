const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const db = {}

db.connectDB = async() => {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME
  })
  .then(() => {
    console.log('Connect success');
  })
  .catch(err => {
    console.log(err);
    process.exit();
  })
}
module.exports = db