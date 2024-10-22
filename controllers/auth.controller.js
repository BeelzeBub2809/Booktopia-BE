const db = require('../models/index')
const mongoose = require('mongoose')
const Helper = require('../helper/helper')

const UserRepository = require('../repositories/User.repository')
const bcrypt = require('bcrypt')
const AuthRepository = require('../repositories/Auth.repository')

async function signup(req, res) {
    try {
        const {
            userName,
            password,
            DOB,
            fullName,
            address,
            email,
            phone,
            status,
            gender,
            roles,
            image
        } = req.body
        //validate request
        if (!userName || !password) {
            Helper.sendFail(res, 400, "Username and password are required!");
            return;
        }

        if (!fullName || !email || !phone) {
            Helper.sendFail(res, 400, "Full name, email and phone are required!");
            return;
        }
        // Validate password
        // This regex ensures the password meets the following criteria:
        // - At least one letter (uppercase or lowercase)
        // - At least one digit
        // - Minimum length of 8 characters
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            Helper.sendFail(res, 400, "Password must be at least 8 characters long and contain at least one letter and one number.");
            return;
        }

        //
        // - One or more non-whitespace characters before the "@" symbol.
        // - One or more non-whitespace characters after the "@" symbol and before the "." symbol.
        // - One or more non-whitespace characters after the "." symbol.
        //  
        // Example of valid email: example@domain.com
        //
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Helper.sendFail(res, 400, "Invalid email format");
            return;
        }

        const user = await AuthRepository.registerUser({
            userName,
            password: bcrypt.hashSync(password, parseInt(process.env.HASH_PASSWORD)), // Hash the password
            DOB,
            fullName,
            address,
            email,
            phone,
            status,
            gender,
            roles,
            image
        });

        if (!user) {
            Helper.sendFail(res, 500, "Error creating user");
            return;
        }
        Helper.sendSuccess(res, 200, user, "User was created successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
        return;
    }
}

//login function
async function login(req, res) {
    try {
        //validate request
        if (!req.body.username || !req.body.password) {
            Helper.sendFail(res, 400, "Username and password are required!");
            return;
        }

        const user = await UserRepository.checkValidUsernameAndPasword(req.body.username, bcrypt.hashSync(req.body.password, 8));
        if (!user) {
            Helper.sendFail(res, 404, "User not found");
            return;
        }

        req.session.user = user;
        Helper.sendSuccess(res, 200, user, "User was logged in successfully!");
    } catch (err) {
        Helper.sendFail(res, 500, err.message);
        return;
    }
}

//logout function
async function logout(req, res) {
    req.session = null;
    Helper.sendSuccess(res, 200, null, "User was logged out successfully!");
}

//forgot password function
async function forgotPassword(req, res) {
}

const AuthController = { signup, login, forgotPassword, logout };
module.exports = AuthController;