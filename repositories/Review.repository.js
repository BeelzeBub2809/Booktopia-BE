const { Review } = require('../models');

class ReviewRepository {
    async createReview(reviewData) {
        try {
            const review = await Review.create(reviewData);
            return review;
        } catch (error) {
            throw new Error('Error creating review: ' + error.message);
        }
    }

    async getReviewById(reviewId) {
        try {
            const review = await Review.findByPk(reviewId);
            return review;
        } catch (error) {
            throw new Error('Error fetching review: ' + error.message);
        }
    }

    async getAllReviews() {
        try {
            const reviews = await Review.findAll();
            return reviews;
        } catch (error) {
            throw new Error('Error fetching reviews: ' + error.message);
        }
    }

    async updateReview(reviewId, reviewData) {
        try {
            const review = await Review.findByPk(reviewId);
            if (!review) {
                throw new Error('Review not found');
            }
            await review.update(reviewData);
            return review;
        } catch (error) {
            throw new Error('Error updating review: ' + error.message);
        }
    }

    async deleteReview(reviewId) {
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
}

module.exports = new ReviewRepository();