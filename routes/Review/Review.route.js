const express = require('express');
const {ReviewController} = require('../../controllers/');

const ReviewRouter = express.Router();

// Example route for getting reviews
ReviewRouter.get('/', ReviewController.getReview);

// Example route for adding a review
ReviewRouter.post('/', ReviewController.createReview);

// Example route for updating a review
ReviewRouter.put('/:id', ReviewController.updateReview);

// Example route for deleting a review
ReviewRouter.delete('/:id', ReviewController.deleteReview);

module.exports = ReviewRouter;