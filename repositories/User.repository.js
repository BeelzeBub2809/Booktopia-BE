const db = require('../models/index');
const mongoose = require('mongoose');

const User = db.User;

// Create new user function
async function createUser(userData) {
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}

// Update user function
async function updateUser(userId, userData) {
    try {
        const user = await User.findByIdAndUpdate(userId, userData, { useFindAndModify: false, new: true });
        return user;
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
}

// Delete user function
async function deleteUser(userId) {
    try {
        const user = await User.findByIdAndDelete(userId);
        return user;
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
}

// Get all users function
async function getUsers() {
    try {
        const users = await User.find().populate('roleId');
        return users;
    } catch (error) {
        throw new Error('Error getting users: ' + error.message);
    }
}

// Get user by id function
async function getUserById(userId) {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw new Error('Error getting user: ' + error.message);
    }
}

async function checkValidUsernameAndPasword(username, password) {
    try {
        const user = await User.findOne({ username: username, password: password });
        return user;
    }catch(error){
        throw new Error('Error getting user: ' + error.message);
    }
}

const UserRepository = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    checkValidUsernameAndPasword
};

module.exports = UserRepository;