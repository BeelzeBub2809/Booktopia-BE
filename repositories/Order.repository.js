const { Order, OrderDetail, Accounting, Product } = require('../models');
const AccountingRepository = require('./Accounting.repository');
const CustomerRepository = require('./Customer.repository');
const ProductRepository = require('./Product.repository');

async function createOrder(orderData) {
    try {
        const customer = await CustomerRepository.getCustomerByUserId(orderData.customerId);
        const customerId = customer._id;
        const order = await Order.create({
            customerId: customerId,
            totalPrice: orderData.totalPrice,
            discount: orderData.total_discount,
            delivery_code: orderData.delivery_code,
            note: orderData.note,
            payment_type_id: orderData.payment_type_id,
            receiver_name: orderData.receiver_name,
            receiver_phone: orderData.receiver_phone,
            receiver_address: orderData.receiver_address,
            receiver_ward_name: orderData.receiver_ward_name,
            receiver_district_name: orderData.receiver_district_name,
            receiver_province_name: orderData.receiver_province_name,
            shipping_fee: orderData.total_fee,
            status: "confirming",
        });

        if (order) {
            for (const order_products of orderData.products) {
                if (order_products.type === 'single') {
                    await Product.findByIdAndUpdate(order_products.productId, {
                        $inc: { quantityInStock: -order_products.quantity }
                    });
                } else if (order_products.type === 'combo') {
                    await Product.findByIdAndUpdate(order_products.productId, {
                        $inc: { quantityInStock: -order_products.quantity }
                    });
                }

                const orderDetail = await OrderDetail.create({
                    orderId: order._id,
                    productId: order_products.productId,
                    amount: order_products.quantity,
                    discount: order_products.discount,
                    price: order_products.price,
                    type: order_products.type
                });

                if (!orderDetail) {
                    throw new Error('Error creating order detail');
                }

                const accounting = await AccountingRepository.StockOut({
                    productId: order_products.productId,
                    quantity: order_products.quantity,
                    orderId: order._id,
                    discount: order_products.discount,
                    price: order_products.price,
                    status: 'pending'
                });

                if (!accounting) {
                    throw new Error('Error creating accounting');
                }
            }
        }
        return order;
    } catch (error) {
        return new Error('Error creating order: ' + error.message);
    }
}

async function getOrderById(orderId) {
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

async function getOrderByUserId(userId) {
    try {
        console.log(userId);
        const customer = await CustomerRepository.getCustomerByUserId(userId);
        const customerId = customer._id;
        let orders = await Order.find({ customerId: customerId });
        if (orders.length === 0) {
            return [];
        } else {
            orders = await Promise.all(orders.map(async (order) => {
                const details = await OrderDetail.find({ orderId: order._id });
                // Get product details for each product in order
                const orderDetails = await Promise.all(details.map(async (detail) => {
                    const product = await ProductRepository.getProductById(detail.productId);
                    return {
                        ...detail.toObject(),
                        productInfo: product ? product.toObject() : null  // Add product details
                    };
                }));

                return {
                    ...order.toObject(),
                    "OrderDetail": orderDetails
                };
            }));
        }

        return orders;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
}

async function updateOrder(orderId, updateData) {
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

async function getOrderDetail(orderId) {
    try {
        const orderDetail = await OrderDetail.find({ orderId }).populate('productId');

        if (!orderDetail) {
            throw new Error('Order detail not found');
        }
        return orderDetail;
    } catch (error) {
        throw new Error('Error fetching order detail: ' + error.message);
    }
}


async function getAllOrders() {
    try {
        let orders = await Order.find();
        if (orders.length === 0) {
            return [];
        } else {
            orders = await Promise.all(orders.map(async (order) => {
                const details = await OrderDetail.find({ orderId: order._id });
                // Get product details for each product in order
                const orderDetails = await Promise.all(details.map(async (detail) => {
                    const product = await ProductRepository.getProductById(detail.productId);
                    return {
                        ...detail.toObject(),
                        productInfo: product ? product.toObject() : null  // Add product details
                    };
                }));

                return {
                    ...order.toObject(),
                    "OrderDetail": orderDetails
                };
            }));
        }

        return orders;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
}


async function getAllUnfinishedOrders() {
    try {
        const orders = await Order.find({ status: { $nin: ['delivered', 'cancel'] } });
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
}

const OrderRepository = {
    createOrder,
    getOrderById,
    getOrderByUserId,
    updateOrder,
    getAllOrders,
    getAllUnfinishedOrders,
    getOrderDetail
}

module.exports = OrderRepository;