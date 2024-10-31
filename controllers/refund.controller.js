const mongoose = require('mongoose');
const RefundRepository = require('../repositories/Refund.repository');
const Helper = require('../helper/helper');
const { uploadImage } = require('../extensions/uploadImage');
const OrderRepository = require('../repositories/Order.repository');

async function getRefundRequestById(req, res) {
    try {
        const refund = await RefundRepository.getRefundRequestById(req.params.id);
        Helper.sendSuccess(res, 200, refund, "Refund request was fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function getRefundRequestsByUserId(req, res) {
    try {
        const refunds = await RefundRepository.getRefundRequestsByUserId(req.params.userId);
        Helper.sendSuccess(res, 200, refunds, "Refund requests were fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function getRefundRequest(req, res) {
    try {
        const refunds = await RefundRepository.getRefundRequest();
        Helper.sendSuccess(res, 200, refunds, "Refund requests were fetched successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function updateRefundRequest(req, res) {
    try {
        const refund = await RefundRepository.updateRefundRequest(req.params.id, req.body);
        Helper.sendSuccess(res, 200, refund, "Refund request was updated successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function deleteRefundRequest(req, res) {
    try {
        const refund = await RefundRepository.deleteRefundRequest(req.params.id);
        Helper.sendSuccess(res, 200, refund, "Refund request was deleted successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function createRefund(req, res) {
    const { name, image: base64Image } = req.body;

    try {
        const imageUrl = await uploadImage(base64Image, name, 'refund');

        const order = await OrderRepository.getOrderById(req.body.orderId);

        const refund = await RefundRepository.createRefund({
            userId: order.customerId,
            orderId: order._id,
            refundReason: req.body.refundReason,
            image: imageUrl,
        });

        Helper.sendSuccess(res, 200, refund, "Refund request was created successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function confirmRefund(req, res) {
    try {
        const refund = await RefundRepository.updateRefundRequest(req.params.id,
            { status: "approved" }
        );
        Helper.sendSuccess(res, 200, refund, "Refund request was confirmed successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function rejectRefund(req, res) {
    try {
        const refund = await RefundRepository.updateRefundRequest(req.params.id,
            { status: "rejected" }
        );
        Helper.sendSuccess(res, 200, refund, "Refund request was rejected successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

const RefundController = {
    getRefundRequestById,
    getRefundRequestsByUserId,
    getRefundRequest,
    updateRefundRequest,
    deleteRefundRequest,
    createRefund,
    confirmRefund,
    rejectRefund
}

module.exports = RefundController;