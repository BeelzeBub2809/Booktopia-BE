const mongoose = require('mongoose')
const OrderRepository = require('../repositories/Order.repository');

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
        const order = OrderRepository.createOrder({
            userId: req.body.userId,
            products: req.body.products,
            total: req.body.total
          });
          res.send({ message: "Order was created successfully!" });
    }catch(err){
        res.status(500).send({message: err});
        return;
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

const OrderController = {
    getOrder,
    updateOrder,
    deleteOrder,
    getUserOrder,
    createNewOrder
};

module.exports = OrderController;