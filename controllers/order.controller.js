const mongoose = require('mongoose')
const OrderRepository = require('../repositories/Order.repository');
const GHNController = require('./GHN.controller');
const Helper = require('../helper/helper');

/**
 * Fetches all orders from the database and sends the response.
 */
async function getOrder(req, res){
    try {
        const orders = await OrderRepository.findAll();
        Helper.sendSuccess(res, 200, orders, "Orders were fetched successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

/**
 * get all orders of a user
 */
async function getUserOrder(req, res){
    try {
        const orders = await OrderRepository.getOrderByUserId(req.params.userId);
        Helper.sendSuccess(res, 200, orders, "Orders were fetched successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

/**
 * Creates a new order based on the request body and sends the response.
 */
async function createNewOrder(req, res){
    try{
        const delivery_detail = await GHNController.callExternalAPI(req.body);
        if (!delivery_detail.data) {
            Helper.sendFail(res, 500, "Error creating delivery code");
            return;
        }
        
        const order = await OrderRepository.createOrder({
            customerId: req.body.userId,
            totalPrice: req.body.total_price,
            discount: req.body.total_discount,
            delivery_code: delivery_detail.data.order_code,
            note: req.body.note,
            payment_type_id: req.body.payment_type_id,
            receiver_name: req.body.receiver_name,
            receiver_phone: req.body.receiver_phone,
            receiver_address: req.body.receiver_address,
            receiver_ward_name: req.body.receiver_ward_name,
            receiver_district_name: req.body.receiver_district_name,
            receiver_province_name: req.body.receiver_province_name,
            shipping_fee: delivery_detail.data.total_fee,
            products: req.body.products.map(product => {
                return {
                    productId: product.productId,
                    quantity: product.quantity
                }
            })
          });

          if (!order) {
                Helper.sendFail(res, 500, "Error creating order");
                return;
            }
          GHNController.checkOrderStatus(order.delivery_code);
          Helper.sendSuccess(res, 200, order, "Order was created successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
        return;
    }
}

/**
 * Previews an order based on the request body and sends the response.
 * Using for calculate shipping fee and estimated delivery time
 */
async function previewOrder(req, res) {
    try{
        const delivery_detail = await GHNController.preivewOrder(req.body);
        if (!delivery_detail.data) {
            Helper.sendFail(res, 500, "Error preview order");
            return;
        }
        Helper.sendSuccess(res, 200, delivery_detail.data, "Order was previewed successfully!");
    }catch(error){
        Helper.sendFail(res, 500, error.message);
    }
}

/**
 * Updates an order based on the request body and sends the response.
 */
async function updateOrder(req, res){
    try {
        const order = await OrderRepository.updateById(req.params.id, req.body);
        if (!order) {
            Helper.sendFail(res, 404, "Order not found");
            return;
        }
        Helper.sendFail(res, 200, order, "Order was updated successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

/**
 * delete an order based on the request body and sends the response.
 */
async function deleteOrder(req, res){
        try {
            const order = await OrderRepository.deleteById(req.params.id);
            if (!order) {
                Helper.sendFail(res, 404, "Order not found");
                return;
            }
            Helper.sendSuccess(res, 200, order, "Order was deleted successfully!");
        } catch (err) {
            Helper.sendFail(res, 500, err.message);
        }
}


async function getAllOrders(req, res){
    try {
        const orders = await OrderRepository.getAllOrders();
        Helper.sendSuccess(res, 200, orders, "Orders were fetched successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

/**
 * Create refend request to refend order
 */
async function refundOrder(req, res){
    try{
        const order = await OrderRepository.getOrderById(req.params.id);
        if (!order) {
            Helper.sendFail(res, 404, "Order not found");
            return;
        }

        if(order.status !== "delivered"){
            Helper.sendFail(res, 400, "Order can't be refunded");
            return;
        }
        const newOrder = await GHNController.refundOrder(order);
        Helper.sendSuccess(res, 200, newOrder, "Order was refunded successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
    }
}

/**
 * Cancel an order based on the request body and sends the response.
 */
async function cancelOrder(req, res){
    try{
        const order = await OrderRepository.getOrderById(req.params.id);
        if (!order) {
            Helper.sendFail(res, 404, "Order not found");
            return;
        }

        if(order.status === "cancel"|| order.status === "delivered"){
            Helper.sendFail(res, 400, "Order can't be canceled");
            return;
        }
        const newOrder = await GHNController.cancelOrder(order);
        Helper.sendSuccess(res, 200, newOrder, "Order was canceled successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
    }
}


const OrderController = {
    getOrder,
    updateOrder,
    deleteOrder,
    getUserOrder,
    createNewOrder,
    getAllOrders,
    previewOrder,
    cancelOrder,
    refundOrder,
};

module.exports = OrderController;
