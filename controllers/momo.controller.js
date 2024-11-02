const OrderController = require('./order.controller');
const GHNController = require('./GHN.controller');
const crypto = require('crypto');
const fetch = require('node-fetch');
const OrderRepository = require('../repositories/Order.repository');
const ProductRepository = require('../repositories/Product.repository');
const Helper = require('../helper/helper');
async function createPaymentLink(req, res, next) {
  try {

    const { userId, total_price, total_discount, note, receiver_name, receiver_phone, receiver_address, receiver_ward_name, receiver_district_name, receiver_province_name, products } = req.body;

    if (!userId || !total_price || !receiver_name || !receiver_phone || !receiver_address || !receiver_ward_name || !receiver_district_name || !receiver_province_name || !products || !Array.isArray(products) || products.length === 0) {
      Helper.sendFail(res, 400, "Invalid input data");
      return;
    }

    for (const product of products) {
      if (!product.productId || !product.quantity || product.quantity <= 0) {
        Helper.sendFail(res, 400, "Invalid product data");
        return;
      } else if (product.type !== "single" && product.type !== "combo") {
        Helper.sendFail(res, 400, "Invalid product type");
        return;
      }
    }

    for (const productInOrder of req.body.products) {
      const product = await ProductRepository.getProductById(productInOrder.productId);
      if (product.quantityInStock < productInOrder.quantity) {
        throw new Error(product.name + ' is only have ' + product.quantityInStock + ' product in stock');
      }
    }
    const delivery_detail = await GHNController.preivewOrder(req.body);
    const order = await OrderRepository.createOrder({
      customerId: req.body.userId,
      totalPrice: req.body.total_price,
      discount: req.body.total_discount,
      note: req.body.note,
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
          quantity: product.quantity,
          discount: product.discount ?? 0,
          price: product.price ?? 0,
          type: product.type
        }
      })
    });

    if (!order) {
      Helper.sendFail(res, 500, "Error creating order");
      return;
    }
    GHNController.checkOrderStatus(order.delivery_code);
    console.log(order);
    
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = order._id.toString();
    const partnerCode = 'MOMO';
    const redirectUrl = 'http://localhost:3000/';
    const ipnUrl = ' https://7d90-42-116-229-104.ngrok-free.app/api/payment/receive-momo-data';
    const requestType = "payWithMethod";
    const amount = order.totalPrice.toString();
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = '';
    const orderGroupId = '';
    const autoCapture = true;
    const lang = 'vi';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature
    });

    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      body: requestBody
    };


    const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', option);
    const result = await response.json();

    if (response.ok) {
      return res.status(200).json(result);
    } else {
      console.error('Error response from MoMo:', result);
      return res.status(response.status).json(result);
    }
  } catch (error) {
    Helper.sendFail(res, 500, error.message);
  }
}

async function receiveDataFromMomo(req, res, next) {
  try {    
    if (!req.body) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    if (req.body.resultCode == 0) {
      const order = await OrderRepository.getOrderById(req.body.orderInfo);
      if (!order) {
        Helper.sendFail(res, 404, "Order not found");
        return;
      }

      if (order.status !== "confirming") {
        Helper.sendFail(res, 400, "Order can't be confirmed");
        return;
      }

      const order_detail = await OrderRepository.getOrderDetail(order._id);

      const delivery_detail = await GHNController.callExternalAPI({
        payment_type_id: order.payment_type_id,
        receiver_name: order.receiver_name,
        receiver_phone: order.receiver_phone,
        receiver_address: order.receiver_address,
        receiver_ward_name: order.receiver_ward_name,
        receiver_district_name: order.receiver_district_name,
        receiver_province_name: order.receiver_province_name,
        note: order.note,
        products_list: order_detail.map(product => {
          return {
            productId: product.productId._id,
            quantity: product.amount,
            type: product.type || "single"
          }
        })
      });
      if (!delivery_detail.data) {
        Helper.sendFail(res, 500, "Error creating delivery code");
        return;
      }

      const updatedOrder = await OrderRepository.updateOrder(order._id, {
        delivery_code: delivery_detail.data.order_code,
        status: "ready_to_pick"
      });

      await GHNController.checkOrderStatus(updatedOrder.delivery_code);
    } else {
      const order = await OrderRepository.getOrderById(req.body.orderInfo);
      if (!order) {
        Helper.sendFail(res, 404, "Order not found");
        return;
      }

      if (order.status !== "confirming") {
        Helper.sendFail(res, 400, "Order can't be canceled");
        return;
      }
      await OrderRepository.cancelOrder(order._id);
      Helper.sendFail(res, 400, 'Payment failed');
      return;
    }
    Helper.sendSuccess(res, 200, req.body ,{ message: 'Payment successful' });
  } catch (error) {
    Helper.sendFail(res, 500, error.message);
  }
}


const MomoController = {
  createPaymentLink, receiveDataFromMomo
};
module.exports = MomoController;