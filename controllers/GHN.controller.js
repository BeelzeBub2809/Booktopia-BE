const axios = require('axios');
const cron = require('node-cron');
const ProductRepository = require('../repositories/Product.repository');
const OrderRepository = require('../repositories/Order.repository');
const ComboRepository = require('../repositories/Combo.repository');
const RefundRepository = require('../repositories/Refund.repository');
const AccountingRepository = require('../repositories/Accounting.repository');

// Load environment variables from .env file
require('dotenv').config();

const shopAddredd = {
    "_id": 194643,
    "name": "Paper_Lover_HN_Storage",
    "phone": "0986966744",
    "address": "Thạch Thất, Hanoi, Vietnam",
    "ward_code": "1B1918",
    "district_id": 1808,
    "client_id": 2509115,
    "bank_account_id": 0,
    "status": 1,
    "location": {
        "lat": 20.9905234,
        "long": 105.5251894
    },
    "version_no": "70e54e40-5d1b-4e0e-99a4-ad588283e384",
    "is_created_chat_channel": false,
    "updated_ip": "118.70.211.226",
    "updated_employee": 0,
    "updated_client": 2509115,
    "updated_source": "shiip",
    "updated_date": "2024-09-25T01:01:27.607Z",
    "created_ip": "",
    "created_employee": 0,
    "created_client": 0,
    "created_source": "",
    "created_date": "2024-09-25T00:55:55.54Z"
}

// Hàm gọi API bên thứ 3 để tạo đơn hàng
async function callExternalAPI({
    // sender info, default is shop address
    // change to customer address if refund
    from_name = shopAddredd.name,
    from_phone = shopAddredd.phone,
    from_address = shopAddredd.address,
    from_ward_name = "Xã Thạch Hoà",
    from_district_name = "Thạch Thất",
    from_province_name = "Hà Nội",

    // receiver info, default is shop address. You can change it to customer address
    // change to customer address if create order
    receiver_name = shopAddredd.name,
    receiver_phone = shopAddredd.phone,
    receiver_address = shopAddredd.address,
    receiver_ward_name = "Xã Thạch Hoà",
    receiver_district_name = "Thạch Thất",
    receiver_province_name = "Hà Nội",

    note,
    products_list
}) {
    console.log(products_list);

    // handle request body
    let products = await Promise.all(products_list.map(async product => {
        if(product.type == "combo"){
            const comboDetail = await ComboRepository.findById(product.productId);
            return {
                "name": comboDetail.name,
                "quantity": parseInt(product.quantity, 10),
                "type": productDetail.type
            }
        }else if(product.type == "single"){
            const productDetail = await ProductRepository.getProductById(product.productId);
            return {
                "name": productDetail.name,
                "quantity": parseInt(product.quantity, 10),
                "type": product.type
            }
        }
    }));
    
    let requestBody = {
        'from_name': from_name,
        'from_phone': from_phone,
        'from_address': from_address, // example: "Số 1, Ngõ 1, Ngách 1, Phố 1, Phường Cửa Nam, Quận Hoàn Kiếm, Hà Nội"
        'from_ward_name': from_ward_name, // example: "Phường C��a Nam"
        'from_district_name': from_district_name, // example: "Quận Hoàn Kiếm"
        'from_province_name': from_province_name, // example: "Hà Nội"
        'to_name': receiver_name,
        'to_phone': receiver_phone,
        'to_address': receiver_address, // example: "Số 1, Ngõ 1, Ngách 1, Phố 1, Phường Cửa Nam, Quận Hoàn Kiếm, Hà Nội"
        'to_ward_name': receiver_ward_name, // example: "Phường Cửa Nam"
        'to_district_name': receiver_district_name, // example: "Quận Hoàn Kiếm"
        'to_province_name': receiver_province_name, // example: "Hà Nội"
        "weight": 200,
        "length": 1,
        "width": 19,
        "height": 10,
        'service_type_id': await getAvailableServiceTypeId(receiver_district_name,receiver_province_name),
        'payment_type_id': 2, //1 nếu trả trước, 2 nếu trả sau
        'required_note': "CHOXEMHANGKHONGTHU",
        "items": products,
        'note': note, //ghi chú đơn hàng cho tài xế
    }

    const url = process.env.GHN_API_ENDPOINT + '/shipping-order/create';

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'ShopId': process.env.SHOP_ID,
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

        console.log(`Updating order ${order._id} status to ${orderStatus}`);
        // Cập nhật trạng thái đơn hàng trong hệ thống của bạn
        const newOrder = await OrderRepository.updateOrder(order._id, {
            "status": orderStatus
        });

        // Update accounting records based on the new order status
        if (orderStatus === 'cancel') {
            await AccountingRepository.updateAccountingStatusByOrderId(order._id, 'fail');
        } else if (orderStatus === 'delivered') {
            await AccountingRepository.updateAccountingStatusByOrderId(order._id, 'success');
        }

        console.log(`Order ${order._id} updated successfully`);
        return newOrder;
    } catch (error) {
        console.error('Error checking order status:', error);
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
        'service_type_id': await getAvailableServiceTypeId(request.receiver_district_name,request.receiver_province_name),
        'payment_type_id': 2, //1 nếu trả trước, 2 nếu trả sau
        'required_note': "CHOXEMHANGKHONGTHU",
        "items": products,
    }

    const url = process.env.GHN_API_ENDPOINT + '/shipping-order/preview';

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'ShopId': process.env.SHOP_ID,
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
        if(order.delivery_code){
            await updateOrderStatus(order);
        }
    });
}

// Hàm kiểm tra trạng thái của returning order
async function checkReturningOrderStatus() {
    let refunds = await RefundRepository.getRefundRequest();
    refunds.forEach(async (refund) => {
        if(refund.status === 'return'){
            await updaterefundStatus(refund);
        }
    });
}

async function updaterefundStatus(refund){
    const url = process.env.GHN_API_ENDPOINT + `/shipping-order/detail`;
    try {
        const response = await axios.post(url, {
            "order_code": refund.refund_delivery_code
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': process.env.GHN_API_TOKEN
                },
            });

        const refundStatus = response.data.data.status;
        console.log(`Order ${refund._id} status: ${refundStatus}`);

        if (refund.status === refundStatus) {
            return refund;
        }

        console.log(`Updating order ${order._id} status to ${orderStatus}`);
        // Cập nhật trạng thái đơn hàng trong hệ thống của bạn
        const newRefund = await RefundRepository.updateRefundRequest(order._id, {
            "status": refundStatus
        });
        console.log(`Order ${refund._id} updated successfully`);
        return newRefund;
    } catch (error) {
        console.error('Error checking order status:', error);
    }
}

async function returnOrder(order_id){
    let order = await OrderRepository.getOrderById(order_id);
    
    const url = process.env.GHN_API_ENDPOINT + `/switch-status/return`;

    try {
        const response = await axios.post(url, {
            "order_codes": [order.delivery_code]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': process.env.GHN_API_TOKEN
            }
        });

        if(response.data.code != 200){
            console.log(`Error returning order ${order._id}: ${response.data.message}`);
        }

        // Cập nhật trạng thái đơn hàng trong hệ thống của bạn
        const newOrder = await OrderRepository.updateOrder(order._id, {
            "status": "return"
        });
        console.log(`Order ${order._id} returned successfully`);
        return newOrder;
    }catch(error){
        console.error('Error returning order:', error);
        throw error;
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

        // Update accounting records based on the order cancellation
        await AccountingRepository.updateAccountingStatusByOrderId(order._id, 'fail');

        console.log(`Order ${order._id} canceled successfully`);
        return newOrder;
    }catch(error){
        console.error('Error canceling order:', error);
        throw error;
    }
}

async function getProvinceCodeByName(provinceName) {
    const url = process.env.GHN_API_MASTER_DATA + '/province';

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Token': process.env.GHN_API_TOKEN
            }
        });

        const provinces = response.data.data;
        const province = provinces.find(p => 
            p.ProvinceName.toLowerCase() === provinceName.toLowerCase() || 
            (p.NameExtension?.some(ext => ext.toLowerCase() === provinceName.toLowerCase()))
        );

        if (province) {
            return province.ProvinceID;
        } else {
            throw new Error(`Province with name ${provinceName} not found`);
        }
    } catch (error) {
        console.error('Error fetching province code:', error);
        throw error;
    }
}

async function getDistrictCodeByName(districtName, provinceName) {
    const provinceCode = await getProvinceCodeByName(provinceName);
    const url = process.env.GHN_API_MASTER_DATA + '/district';

    try {
        const response = await axios.post(url, {
            "province_id": provinceCode
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': process.env.GHN_API_TOKEN
            }
        });

        const districts = response.data.data;
        const district = districts.find(d => d.district_name === districtName
            || d.NameExtension.includes(districtName));
        if (district) {
            return district.DistrictID;
        } else {
            throw new Error(`District ${districtName} not found in province ${provinceName}`);
        }
    } catch (error) {
        console.error('Error fetching district code:', error);
        throw error;
    }
}

async function getAvailableServiceTypeId(districtName, provinceName) {
    const provinceCode = await getDistrictCodeByName(districtName, provinceName);
    const url = process.env.GHN_API_ENDPOINT + '/shipping-order/available-services';

    console.log(`Fetching available service type id for province code ${provinceCode}`);
    try {
        const response = await axios.post(url, {
            "shop_id": parseInt(process.env.GHN_SHOP_ID, 10),
            "from_district": 1808,
            "to_district": provinceCode
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': process.env.GHN_API_TOKEN
            }
        });

        const services = response.data.data;
        if (services && services.length > 0) {
            return services[0].service_type_id; // Return the first available service type id
        } else {
            throw new Error(`No available services found for province code ${provinceCode}`);
        }
    } catch (error) {
        console.error('Error fetching available service type id:', error);
        throw error;
    }
}

// Tạo cron job để kiểm tra trạng thái đơn hàng
cron.schedule('* * * * *', () => {
    console.log('Checking order status...');
    checkOrderStatus();
    checkReturningOrderStatus();
});

module.exports = {
    callExternalAPI,
    updateOrderStatus,
    checkOrderStatus,
    preivewOrder,
    cancelOrder,
    returnOrder,
    checkReturningOrderStatus
};