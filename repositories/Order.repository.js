const { Order,OrderDetail,Accounting } = require('../models');
const AccountingRepository = require('./Accounting.repository');

class OrderRepository {
    async createOrder(orderData) {
        try {
            const order = await Order.create({
                customerId: orderData.userId,
                totalPrice: orderData.total_price,
                discount: orderData.total_discount,
                delivery_code: orderData.order_code,
                note: orderData.note,
                payment_type_id: orderData.payment_type_id,
                receiver_name: orderData.receiver_name,
                receiver_phone: orderData.receiver_phone,
                receiver_address: orderData.receiver_address,
                receiver_ward_name: orderData.receiver_ward_name,
                receiver_district_name: orderData.receiver_district_name,
                receiver_province_name: orderData.receiver_province_name,
                shipping_fee: orderData.total_fee,
            });

            if(order){
                orderData.products.each(async (orderData) => {
                    const orderDetail = await OrderDetail.create({
                        orderId: order._id,
                        productId: orderData.productId,
                        quantity: orderData.quantity,
                        discount: orderData.discount,
                        price: orderData.totalPrice
                    });
                    if(!orderDetail){
                        throw new Error('Error creating order detail');
                    }
                });

                const accounting = await AccountingRepository.StockOut({
                    productid: orderData.productId,
                    quantity: orderData.quantity,
                    orderId: order._id,
                    discount: orderData.discount,
                    price: orderData.totalPrice,
                    status: 'pending'
                });

                if(!accounting){
                    throw new Error('Error creating accounting');
                }
            }
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