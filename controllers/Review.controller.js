const mongoose = require('mongoose')
const { Review} = require('../models');


const ReviewRepository = require('../repositories/Review.repository');
const Helper = require('../helper/helper');
const CustomerRepository = require('../repositories/Customer.repository');

async function createReview(req, res) {
    try {
        const customerIdraw = typeof req.body.customerId === 'string' ? req.body.customerId.replace(/"/g, '') : req.body.customerId;
        const productId = typeof req.body.productId === 'string' ? req.body.productId.replace(/"/g, '') : req.body.productId;

        const customer = await CustomerRepository.getCustomerByUserId(customerIdraw);
        const customerId = customer._id;

        // Kiểm tra xem đã có đánh giá của customerId cho productId chưa
        const existingReview = await Review.findOne({ customerId: customerId, productId: productId });

        if (existingReview) {
            return Helper.sendFail(res, 400, "You have already reviewed this product."); // Trả về thông báo lỗi
        }

        // Nếu chưa có đánh giá, tiến hành tạo đánh giá mới
        const review = await ReviewRepository.createReview({
            customerId: customerId,
            productId: productId,
            rating: req.body.rating,
            content: req.body.content
        });

        Helper.sendSuccess(res, 200, review, "Review was created successfully");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
        return;
    }
}



async function getReview(req, res){
    console.log(req.user);
    try {
        const reviews = await ReviewRepository.getAllReviews();
        Helper.sendSuccess(res, 200, reviews, "Reviews were fetched successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

async function getReviewById(req, res){
    try {
        const review = await ReviewRepository.getReviewById(req.params.id);
        if (!review) {
            Helper.sendFail(res, 404, "Review not found");
            return;
        }
        Helper.sendSuccess(res, 200, review, "Review was fetched successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

async function updateReview(req, res){
    try {
        const review = await ReviewRepository.updateReview(req.params.id, req.body);
        if (!review) {
            Helper.sendFail(res, 404, "Review not found");
            return;
        }
        Helper.sendSuccess(res, 200, review, "Review was updated successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

async function deleteReview(req, res){
    try {
        const review = await ReviewRepository.deleteReview(req.params.id);
        if (!review) {
            Helper.sendFail(res, 404, "Review not found");
            return;
        }
        Helper.sendSuccess(res, 200, review, "Review was deleted successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

async function getBookReview(req, res){
    try {
        const reviews = await ReviewRepository.getReviewByCondition({
            productId: req.params.productId,
            ...(req.body.userId ? { userId: req.body.userId } : {})
        });
        Helper.sendSuccess(res, 200, reviews, "Reviews of book were fetched successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
    }
}

const ReviewController = {
    createReview,
    getReview,
    getReviewById,
    updateReview,
    deleteReview,
    getBookReview
};
module.exports = ReviewController;