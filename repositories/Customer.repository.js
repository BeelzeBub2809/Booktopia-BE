const db = require('../models/index');
const mongoose = require('mongoose');

const Customer = db.Customer;
const UserRepository = require('./User.repository');
const RoleRepository = require('./Role.repository');

// Create new user function
async function createAccount({userName,password}){
    try {
        const role = await RoleRepository.getRoleByName('customer');

        let newUser = await UserRepository.createUser({
            "userName": userName,
            "password": password,
            "roleId": role._id
        });
        
        let newCustomer = await Customer.create({userId: newUser._id});
        return newCustomer;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}

async function getCustomerById(customerId){
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    } catch (error) {
        throw new Error('Error fetching customer: ' + error.message);
    }
}

async function getCustomerByUserId(userId){
    try {
        const customer = await Customer.findOne ({userId: userId});
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;        
    }
    catch (error) {
        throw new Error('Error fetching customer: ' + error.message);
    }
}

const CustomerRepository = {
    createAccount, getCustomerByUserId
};

module.exports = CustomerRepository;