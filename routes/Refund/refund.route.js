const express = require('express');
const {RefundController} = require('../../controllers/');

const RefundRouter = express.Router();

RefundRouter.post('/create', RefundController.createRefund);

RefundRouter.get('/', RefundController.getRefundRequest);

RefundRouter.get('/:id', RefundController.getRefundRequestById);

RefundRouter.put('/:id', RefundController.updateRefundRequest);

RefundRouter.delete('/:id', RefundController.deleteRefundRequest);

RefundRouter.get('/user/:userId', RefundController.getRefundRequestsByUserId);

RefundRouter.post('/confirm/:id', RefundController.confirmRefund);

RefundRouter.post('/reject/:id', RefundController.rejectRefund);

module.exports = RefundRouter;