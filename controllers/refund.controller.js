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
    const { name, images: base64Image } = req.body;

    try {
        const imageUrl = await uploadImage(base64Image, name, 'refund');
        const refund = await RefundRepository.createRefundRequest({
            orderId: req.body.orderId,
            reason: req.body.reason,
            image: imageUrl,
        });

        Helper.sendSuccess(res, 200, refund, "Refund request was created successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function confirmRefund(req, res) {
    try {
        const refund = await RefundRepository.getRefundRequestById(req.params.id);
        if (refund.status !== "pending") {
            Helper.sendFail(res, 400, "Refund request is not pending!");
            return;
        }
        const updatedRefund = await RefundRepository.updateRefundRequest(req.params.id,
            { status: "approved" }
        );
        const order = await OrderRepository.getOrderById(refund.orderId);
        if(!order){
            throw new Error('Order not found');
        }
        order.status = 'refund';
        await order.save();
        Helper.sendSuccess(res, 200, updatedRefund, "Refund request was confirmed successfully!");
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