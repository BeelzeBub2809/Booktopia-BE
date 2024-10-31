const { Refund } = require("../models");
const GHNController = require('../controllers/GHN.controller');

async function createRefundRequest({
    userId,
    orderId,
    refundReason,
    image
}) {
    try {
        return await Refund.create({
            userId: userId,
            orderId: orderId,
            refundReason: refundReason,
            image: image,
            refundStatus: "pending"
        });
    } catch (error) {
        throw new Error('Error creating refund: ' + error.message);
    }
}

async function changeRefundStatus(refundId, status) {
    try {
        const refund = await Refund.findByIdAndUpdate(refundId, { status: status }, { new: true });
        if (!refund) {
            throw new Error('Refund not found');
        }
        if(status === "approved") {
            //return order và gửi thông báo về cho người dùng
            await GHNController.returnOrder(refund.orderId);
        }

        if(status === "rejected") {
            //reject refendRequest và gửi thông báo về cho người dùnga
        }

        return refund;
    }catch (error) {
        throw new Error('Error updating refund: ' + error.message);
    }
}

async function getRefundRequestById(refundId) {
    try {
        const refund = await Refund.findById(refundId);
        if (!refund) {
            throw new Error('Refund not found');
        }
        return refund;
    } catch (error) {
        throw new Error('Error fetching refund: ' + error.message);
    }
}

async function getRefundRequestsByUserId(userId) {
    try {
        const refunds = await Refund
            .find({ userId: userId })
            .exec();
        if (!refunds) {
            throw new Error('Refund not found');
        }
        return refunds;
    } catch (error) {
        throw new Error('Error fetching refund: ' + error.message);
    }
}

async function getRefundRequest(){
    try {
        return await Refund.find();
    } catch (error) {
        throw new Error('Error fetching refunds: ' + error.message);
    }
}

async function updateRefundRequest(refundId, updateData) {
    try {
        const refund = await Refund.findByIdAndUpdate(refundId, updateData, { new: true });
        if (!refund) {
            throw new Error('Refund not found');
        }
        return refund;
    }catch (error) {
        throw new Error('Error updating refund: ' + error.message);
    }
}

async function deleteRefundRequest(refundId) {
    try {
        const refund = await Refund.findByIdAndDelete(refundId);
        if (!refund) {
            throw new Error('Refund not found');
        }
        return refund;
    } catch (error) {
        throw new Error('Error deleting refund: ' + error.message);
    }
}

const RefundRepository = {
    createRefundRequest,
    getRefundRequestById,
    getRefundRequestsByUserId,
    getRefundRequest,
    updateRefundRequest,
    deleteRefundRequest,
    changeRefundStatus
};

module.exports = RefundRepository;