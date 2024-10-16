const mongoose = require('mongoose')

const ReviewRepository = require('../repositories/Review.repository')

async function createReview(req, res){
    try{
        console.log(req.body);
        const review = await ReviewRepository.createReview({
            userId: req.body.userId,
            productId: req.body.productId,
            rating: req.body.rating,
            content: req.body.content
        });
        res.send({ message: "Review was created successfully!" });
    }catch(err){
        res.status(500).send({message: err});
        return;
    }
}

async function getReview(req, res){
    try {
        const reviews = await ReviewRepository.getAllReviews();
        res.send(reviews);
    } catch (err) {
        res.status(500).send({ message: err });
    }
}

async function getReviewById(req, res){
    try {
        const review = await ReviewRepository.getReviewById(req.params.id);
        if (!review) {
            res.status(404).send({ message: "Review not found" });
            return;
        }
        res.send(review);
    } catch (err) {
        res.status(500).send({ message: err });
    }
}

async function updateReview(req, res){
    try {
        const review = await ReviewRepository.updateReview(req.params.id, req.body);
        if (!review) {
            res.status(404).send({ message: "Review not found" });
            return;
        }
        res.send({ message: "Review was updated successfully!" });
    } catch (err) {
        res.status(500).send({ message: err });
    }
}

async function deleteReview(req, res){
    try {
        const review = await ReviewRepository.deleteReview(req.params.id);
        if (!review) {
            res.status(404).send({ message: "Review not found" });
            return;
        }
        res.send({ message: "Review was deleted successfully!" });
    } catch (err) {
        res.status(500).send({ message: err });
    }
}

async function getBookReview(req, res){
    try {
        const reviews = await ReviewRepository.getReviewByCondition({
            productId: req.params.productId,
            ...(req.body.userId ? { userId: req.body.userId } : {})
        });
        res.send(reviews);
    } catch (err) {
        res.status(500).send({ message: err });
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