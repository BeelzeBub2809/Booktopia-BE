const { Review,User } = require('../models');

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
        const review = await Review.findById(reviewId);
        return review;
    } catch (error) {
        throw new Error('Error fetching review: ' + error.message);
    }
}

async function getAllReviews() {
    try {
        const reviews = await Review.find()
        .select('_id customerId productId content rating createdAt updatedAt status') // Select only required fields at the review level
        .populate({
            path: 'customerId',
            select: '_id userId', // Select only _id and userId from customerId
            populate: {
                path: 'userId',
                model: 'DBUser',
                select: 'userName' // Select only userName from DBUser
            }
        }).populate({
           path:'productId',
              select:'_id name image'
        });
    return reviews;
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
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        return true; // Return true if the review was successfully deleted
    } catch (error) {
        throw new Error('Error deleting review: ' + error.message);
    }
}



//get reviews by condition
async function getReviewByCondition(condition) {
    try {
        const reviews = await Review.find(condition)
            .select('_id customerId productId content rating createdAt updatedAt status') // Select only required fields at the review level
            .populate({
                path: 'customerId',
                select: '_id userId', // Select only _id and userId from customerId
                populate: {
                    path: 'userId',
                    model: 'DBUser',
                    select: 'userName' // Select only userName from DBUser
                }
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