const { Review } = require('../models');

async function createReview(reviewData) {
    try {
        const review = await Review.create(reviewData);
        return review;
    } catch (error) {
        throw new Error('Error creating review: ' + error.message);
    }
}

async function getReviewById(reviewId) {
    try {
        const review = await Review.findByPk(reviewId);
        return review;
    } catch (error) {
        throw new Error('Error fetching review: ' + error.message);
    }
}

async function getAllReviews() {
    try {
        return await Review.find();
    } catch (error) {
        throw new Error('Error fetching reviews: ' + error.message);
    }
}

async function updateReview(reviewId, reviewData) {
    try {
        return await Review.findByIdAndUpdate(reviewId, reviewData, { new: true });
    } catch (error) {
        throw new Error('Error updating review: ' + error.message);
    }
}

async function deleteReview(reviewId) {
    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        await review.destroy();
        return true;
    } catch (error) {
        throw new Error('Error deleting review: ' + error.message);
    }
}

//get reviews by condition
async function getReviewByCondition(condition) {
    try {
        const reviews = await Review.findAll({
            where: condition
        });
        return reviews;
    } catch (error) {
        throw new Error('Error fetching reviews: ' + error.message);
    }
}

const ReviewRepository = {
    createReview,
    getReviewById,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewByCondition
}

module.exports = ReviewRepository;