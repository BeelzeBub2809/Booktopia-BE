const axios = require('axios');
const cron = require('node-cron');
const ProductRepository = require('../repositories/Product.repository');
const OrderRepository = require('../repositories/Order.repository');
const ComboRepository = require('../repositories/Combo.repository');

// Load environment variables from .env file
require('dotenv').config();

// Hàm gọi API bên thứ 3 để tạo đơn hàng
async function callExternalAPI(request) {
    // handle request body
    let products = await Promise.all(request.products.map(async product => {
        if(product.type == "combo"){
            const comboDetail = await ComboRepository.findById(product.productId);
            return {
                "name": comboDetail.name,
                "quantity": parseInt(product.quantity, 10)
            }
        }else if(product.type == "single"){
            const productDetail = await ProductRepository.getProductById(product.productId);
            return {
                "name": productDetail.name,
                "quantity": parseInt(product.quantity, 10)
            }
        }
    }));

    let requestBody = {
        'to_name': request.receiver_name,
        'to_phone': request.receiver_phone,
        'to_address': request.receiver_address, // example: "Số 1, Ngõ 1, Ngách 1, Phố 1, Phường Cửa Nam, Quận Hoàn Kiếm, Hà Nội"
        'to_ward_name': request.receiver_ward_name, // example: "Phường Cửa Nam"
        'to_district_name': request.receiver_district_name, // example: "Quận Hoàn Kiếm"
        'to_province_name': request.receiver_province_name, // example: "Hà Nội"
        "weight": 200,
        "length": 1,
        "width": 19,
        "height": 10,
        'service_type_id': 2,
        'payment_type_id': 2, //1 nếu trả trước, 2 nếu trả sau
        'required_note': "CHOXEMHANGKHONGTHU",
        "items": products,
        'note': request.note, //ghi chú đơn hàng cho tài xế
    }

    const url = process.env.GHN_API_ENDPOINT + '/shipping-order/create';

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'ShopId': process.env.GHN_SHOP_ID,
                'Token': process.env.GHN_API_TOKEN
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error calling external API:', error);
        throw error;
    }
}

// Hàm gọi API bên thứ 3 để cập nhật trạng thái đơn hàng
async function updateOrderStatus(order) {
    const url = process.env.GHN_API_ENDPOINT + `/shipping-order/detail`;
    try {
        const response = await axios.post(url, {
            "order_code": order.delivery_code
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': process.env.GHN_API_TOKEN
                },
            });

        const orderStatus = response.data.data.status;
        console.log(`Order ${order._id} status: ${orderStatus}`);

        if (order.status === orderStatus) {
            return order;
        }

        if (orderStatus === 'delivered') {
            
        }

        console.log(`Updating order ${order._id} status to ${orderStatus}`);
        // Cập nhật trạng thái đơn hàng trong hệ thống của bạn
        const newOrder = await OrderRepository.updateOrder(order._id, {
            "status": orderStatus
        });
        console.log(`Order ${order._id} updated successfully`);
        return newOrder;
    } catch (error) {
        console.error('Error checking order status:', error);
    }
}

// Hàm gọi API bên thứ 3 để huỷ đơn hàng
async function cancelOrder(order) {
    try{
        const url = process.env.GHN_API_ENDPOINT + `/switch-status/cancel`;
        const response = await axios.post(url, {
            "order_codes": [order.delivery_code]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': process.env.GHN_API_TOKEN
            }
        });

        if(response.data.code != 200){
            console.log(`Error canceling order ${order._id}: ${response.data.message}`);
        }

        // Cập nhật trạng thái đơn hàng trong hệ thống của bạn
        const newOrder = await OrderRepository.updateOrder(order._id, {
            "status": "cancel"
        });
        console.log(`Order ${order._id} canceled successfully`);
        return newOrder;
    }catch(error){
        console.error('Error canceling order:', error);
    }
}

// Ham goi API ben thu 3 de xem truoc don hang
async function preivewOrder(request) {
    // handle request body
    let products = await Promise.all(request.products.map(async product => {
        const productDetail = await ProductRepository.getProductById(product.productId);

        return {
            "name": productDetail.name,
            "quantity": parseInt(product.quantity, 10)
        }
    }));

    let requestBody = {
        'to_name': request.receiver_name,
        'to_phone': request.receiver_phone,
        'to_address': request.receiver_address, // example: "Số 1, Ngõ 1, Ngách 1, Phố 1, Phường Cửa Nam, Quận Hoàn Kiếm, Hà Nội"
        'to_ward_name': request.receiver_ward_name, // example: "Phường Cửa Nam"
        'to_district_name': request.receiver_district_name, // example: "Quận Hoàn Kiếm"
        'to_province_name': request.receiver_province_name, // example: "Hà Nội"
        "weight": 200,
        "length": 1,
        "width": 19,
        "height": 10,
        'service_type_id': 2,
        'payment_type_id': 2, //1 nếu trả trước, 2 nếu trả sau
        'required_note': "CHOXEMHANGKHONGTHU",
        "items": products,
        'note': request.note, //ghi chú đơn hàng cho tài xế
    }

    const url = process.env.GHN_API_ENDPOINT + '/shipping-order/preview';

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'ShopId': process.env.GHN_SHOP_ID,
                'Token': process.env.GHN_API_TOKEN
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error calling external API:', error);
        throw error;
    }
}

// Hàm kiểm tra trạng thái đơn hàng
async function checkOrderStatus() {
    let orders = await OrderRepository.getAllOrders();

    orders.forEach(async (order) => {
        await updateOrderStatus(order);
    });
}

// Tạo cron job để kiểm tra trạng thái đơn hàng
// cron.schedule('* * * * *', () => {
//     console.log('Checking order status...');
//     checkOrderStatus();
// });

module.exports = {
    callExternalAPI,updateOrderStatus,checkOrderStatus,preivewOrder,cancelOrder
};