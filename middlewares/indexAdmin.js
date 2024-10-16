const express = require('express');

// middlewares/indexAdmin.js

const router = express.Router();

// Middleware to check if user is an admin
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied. Admins only.');
    }
}

module.exports = {
    isAdmin
};