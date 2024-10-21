const mongoose = require('mongoose')
const OrderRepository = require('../repositories/Order.repository');
const GHNController = require('./GHN.controller');

async function getOrder(req, res){
    try {
        const orders = await OrderRepository.findAll();
        res.send(orders);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

async function getUserOrder(req, res){
    try {
        const orders = await OrderRepository.getOrderByUserId(req.params.userId);
        res.send(orders);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

async function createNewOrder(req, res){
    try{
        /*
        Request body:
        {
            "userId": "string",
            "products": [
                {
                    "productId": "string",
                    "quantity": "number"
                }
            ],
            "receiver_name": "string",
            "receiver_phone": "string",
            "receiver_address": "string",
            "receiver_ward_name": "string",
            "receiver_district_name": "string",
            "receiver_province_name": "string",
            "note": "string" // not requrired
            "payment_type_id": "number" // 1 if pay before, 2 if pay after
            "total_price": "number"
            "total_discount": "number"
        }
        */
        const delivery_detail = await GHNController.callExternalAPI(req.body);
        if (!delivery_detail.data) {
            res.status(500).send({message: "Error creating delivery code"});
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
          });

          if (!order) {
                res.status(500).send({message: "Error creating order"});
                return;
            }
          GHNController.checkOrderStatus(order.delivery_code);
          res.send({ message: "Order was created successfully!" });
    }catch(err){
        res.status(500).send({message: err.message});
        return;
    }
}

async function previewOrder(req, res) {
    const delivery_detail = await GHNController.preivewOrder(req.body);
    if (!delivery_detail.data) {
        res.status(500).send({ message: "Error preview order" });
        return;
    }
    res.send({ data: delivery_detail.data });
}

async function cancelOrder(req, res){
    try{
        const order = await OrderRepository.getOrderById(req.params.id);
        if (!order) {
            res.status(404).send({ message: "Order not found" });
            return;
        }

        if(order.status === "cancel"|| order.status === "delivered"){
            res.status(400).send({ message: "Order can't be canceled" });
            return;
        }
        const newOrder = await GHNController.cancelOrder(order);
        res.send({
            message: "Order was canceled successfully!",
            data: newOrder});
    }catch(err){
        res.status(500).send({
            message: err.message
        });
    }
}

async function updateOrder(req, res){
    try {
        const order = await OrderRepository.updateById(req.params.id, req.body);
        if (!order) {
            res.status(404).send({ message: "Order not found" });
            return;
        }
        res.send({ message: "Order was updated successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

async function deleteOrder(req, res){
        try {
            const order = await OrderRepository.deleteById(req.params.id);
            if (!order) {
                res.status(404).send({ message: "Order not found" });
                return;
            }
            res.send({ message: "Order was deleted successfully!" });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
}

async function getAllOrders(req, res){
    try {
        const orders = await OrderRepository.getAllOrders();
        res.send(orders);
    } catch (err) {
        res.status(500).send({ message: err.message });
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
    cancelOrder
};

module.exports = OrderController;