const mongoose = require('mongoose');
const RefundRepository = require('../repositories/Refund.repository');
const Helper = require('../helper/helper');
const { uploadImage } = require('../extensions/uploadImage');
const OrderRepository = require('../repositories/Order.repository');
const GHNController = require('./GHN.controller');
const DBOrder = require('../models/DBOrder');
const DBRefund = require('../models/DBRefund');


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
        await DBOrder.findByIdAndUpdate(req.body.orderId, { status: 'refund' });
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

        const order = await OrderRepository.getOrderById(refund.orderId);
        if(!order){
            throw new Error('Order not found');
        }
        order.status = 'refund';
        await order.save();
        const order_detail = await OrderRepository.getOrderDetail(order._id);
        const delivery_detail = await GHNController.callExternalAPI({
            totalPrice: 0,
            payment_type_id: 2,
            from_name: order.receiver_name,
            from_phone: order.receiver_phone,
            from_address: order.receiver_address,
            from_ward_name: order.receiver_ward_name,
            from_district_name: order.receiver_district_name,
            from_province_name: order.receiver_province_name,
            note: order.note,
            products_list: order_detail.map(product => {
                if (product.productId) {
                    return {
                        productId: product.productId._id,
                        quantity: product.amount,
                        type: product.type || "single"
                    }
                } else {
                    return {
                        comboId: product.comboId._id,
                        quantity: product.amount,
                        type: product.type || "combo"
                    }
                }
            })
        });
        if (!delivery_detail.data) {
            Helper.sendFail(res, 500, "Error creating delivery code");
            return;
        }
        const updatedRefund = await RefundRepository.updateRefundRequest(req.params.id,
            { 
                status: "approved",
                refund_delivery_code: delivery_detail.data.order_code
            }
        );
        GHNController.checkReturningOrderStatus();
        Helper.sendEmail('nguyenanhtuan28092003@gmail.com', 'Refund request approved', `Your refund request has been approved. Your refund delivery code is ${delivery_detail.data.order_code}`);
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
        Helper.sendEmail('nguyenanhtuan28092003@gmail.com', 'Refund request rejected', `Your refund request has been rejected.`);
        Helper.sendSuccess(res, 200, refund, "Refund request was rejected successfully!");
    } catch (error) {
        Helper.sendFail(res, 500, error.message);
    }
}

async function restockRefund(req, res) {
    try {
        const refund = await DBRefund.findByIdAndUpdate(req.body.refundId, { status: 'refund success' });
        await OrderRepository.refundOrderSuccess(req.body.orderId)
        Helper.sendSuccess(res, 200, refund, "Refund request was restocked successfully!");
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
    rejectRefund,
    restockRefund
}

module.exports = RefundController;