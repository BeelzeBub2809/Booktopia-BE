const { Order } = require('../models');

class OrderRepository {
    async createOrder(orderData) {
        try {
            const order = await Order.create(orderData);
            return order;
        } catch (error) {
            throw new Error('Error creating order: ' + error.message);
        }
    }

    async getOrderById(orderId) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            throw new Error('Error fetching order: ' + error.message);
        }
    }

    async getOrderByUserId(userId) {
        try {
            const order = await Order
                .find({ userId: userId })
                .populate('products')
                .exec();
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            throw new Error('Error fetching order: ' + error.message);
        }
    }

    async updateOrder(orderId, updateData) {
        try {
            const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            throw new Error('Error updating order: ' + error.message);
        }
    }

    async deleteOrder(orderId) {
        try {
            const order = await Order.findByIdAndDelete(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            throw new Error('Error deleting order: ' + error.message);
        }
    }

    async getAllOrders() {
        try {
            const orders = await Order.find();
            return orders;
        } catch (error) {
            throw new Error('Error fetching orders: ' + error.message);
        }
    }
}

module.exports = new OrderRepository();