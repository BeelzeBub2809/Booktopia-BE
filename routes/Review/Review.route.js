const express = require('express');
const {ReviewController} = require('../../controllers/');
const AuthMiddlewares = require('../../middlewares/auth.middleware');

const ReviewRouter = express.Router();

// Example route for getting reviews
ReviewRouter.get('/', ReviewController.getReview);

// Example route for adding a review
ReviewRouter.post('/', ReviewController.createReview);

// Example route for updating a review
ReviewRouter.put('/:id', AuthMiddlewares.verifyUser, ReviewController.updateReview);

// Example route for deleting a review
ReviewRouter.delete('/:id', ReviewController.deleteReview);

// get reviews by book id
ReviewRouter.get('/book/:productId', ReviewController.getBookReview);

module.exports = ReviewRouter;