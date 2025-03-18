const express = require('express');
const {RefundController} = require('../../controllers/');
const Extension = require('../../extensions/uploadImage');
const AuthMiddlewares = require('../../middlewares/auth.middleware');

const RefundRouter = express.Router();

RefundRouter.post('/create',[Extension.upload.array('images', 5)], RefundController.createRefund);

RefundRouter.get('/', RefundController.getRefundRequest);

RefundRouter.get('/:id', RefundController.getRefundRequestById);

RefundRouter.put('/:id', RefundController.updateRefundRequest);

RefundRouter.delete('/:id', RefundController.deleteRefundRequest);

RefundRouter.get('/user/:userId', RefundController.getRefundRequestsByUserId);

RefundRouter.post('/confirm/:id', AuthMiddlewares.verifyUser, RefundController.confirmRefund);

RefundRouter.post('/reject/:id', AuthMiddlewares.verifyUser,RefundController.rejectRefund);
RefundRouter.post('/restock-refund', AuthMiddlewares.verifyUser,RefundController.restockRefund);

module.exports = RefundRouter;