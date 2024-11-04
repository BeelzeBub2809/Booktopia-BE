const mongoose = require('mongoose')

const Accounting = require('./DBAccounting')
const Cart = require('./DBCart')
const CartDetail = require('./DBCartDetail')
const Category = require('./DBCategory')
const Combo = require('./DBCombo')
const Customer = require('./DBCustomer')
const Discount = require('./DBDiscount')
const InternetBanking = require('./DBInternetBanking')
const Notification = require('./DBNotification')
const Order = require('./DBOrder')
const OrderDetail = require('./DBOrderDetail')
const Product = require('./DBProduct')
const Review = require('./DBReview')
const Refund = require('./DBRefund')
const Role = require('./DBRole')
const User = require('./DBUser')

require('dotenv').config()

mongoose.Promise = global.Promise
const db = {}

db.connectDB = async() => {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME
  })
  //Ket noi thanh cong
  .then(() => {
    console.log('Connect success');

  })
  .catch(err => {
    console.log(err);
    process.exit();
  })
  
}

db.Mongoose = mongoose
db.Accounting = Accounting
db.Cart = Cart
db.CartDetail = CartDetail
db.Category = Category
db.Combo = Combo
db.Customer = Customer
db.Discount = Discount
db.InternetBanking = InternetBanking
db.Notification = Notification
db.Order = Order
db.OrderDetail = OrderDetail
db.Product = Product
db.Review = Review
db.Refund = Refund
db.Role = Role
db.User = User

module.exports = db