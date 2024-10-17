const { Order,OrderDetail } = require('../models');

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
            let orders = await Order.find();
            if(orders.length === 0) {
                throw new Error('No orders found');
            }else{
                orders = await Promise.all(orders.map(async (order) => {
                    const detail = await OrderDetail.find({
                        orderId: order._id
                    });
                    return {
                        ...order.toObject(),
                        "OrderDetail": detail
                    };
                }));
            }

            return orders;
        } catch (error) {
            throw new Error('Error fetching orders: ' + error.message);
        }
    }

    async getAllUnfinishedOrders() {
        try {
            const orders = await Order.find({ status: { $nin: ['delivered', 'cancel'] } });
            return orders;
        } catch (error) {
            throw new Error('Error fetching orders: ' + error.message);
        }
    }
}

module.exports = new OrderRepository();