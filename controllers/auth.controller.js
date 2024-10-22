const db = require('../models/index')
const mongoose = require('mongoose')
const Helper = require('../helper/helper')

const UserRepository = require('../repositories/User.repository')
const RoleRepository = require('../repositories/Role.repository')
const CustomerRepository = require('../repositories/Customer.repository')
const bcrypt = require('bcrypt')

async function signup (req, res){
    try{
        //validate request
        if (!req.body.username || !req.body.password) {
            Helper.sendFail(res, 400, "Username and password are required!");
            return;
        }

        // Validate password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
            Helper.sendFail(res, 400, "Password must be at least 8 characters long and contain at least one letter and one number.");
            return;
        }

        let user = await CustomerRepository.createAccount({
            userName: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8)
        });        

        if(!user){
            Helper.sendFail(res, 500, "Error creating user");
            return;
        }
        Helper.sendSuccess(res, 200, user, "User was created successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
        return;
    }
}

//login function
async function login(req, res){
    try{
        //validate request
        if (!req.body.username || !req.body.password) {
            Helper.sendFail(res, 400, "Username and password are required!");
            return;
        }

        const user = await UserRepository.checkValidUsernameAndPasword(req.body.username, bcrypt.hashSync(req.body.password, 8));
        if(!user){
            Helper.sendFail(res, 404, "User not found");
            return;
        }

        req.session.user = user;
        Helper.sendSuccess(res, 200, user, "User was logged in successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
        return;
    }
}

//logout function
async function logout(req, res){
    req.session = null;
    Helper.sendSuccess(res, 200, null, "User was logged out successfully!");
}

//forgot password function
async function forgotPassword(req, res){
}

const AuthController = {signup,login,forgotPassword,logout};
module.exports = AuthController;