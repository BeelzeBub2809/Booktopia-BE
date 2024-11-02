const express = require('express')
const MomoController = require('../../controllers/momo.controller')
const AuthMiddlewares = require('../../middlewares/auth.middleware')
const MomoRouter = express.Router()
MomoRouter.post('/create-payment-link',AuthMiddlewares.verifyUser, MomoController.createPaymentLink)
MomoRouter.post('/receive-momo-data', MomoController.receiveDataFromMomo)
module.exports = MomoRouter