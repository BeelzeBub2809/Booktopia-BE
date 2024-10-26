const db = require('../models/index')
const mongoose = require('mongoose')
const Helper = require('../helper/helper')

const UserRepository = require('../repositories/User.repository')
const bcrypt = require('bcrypt')
const AuthRepository = require('../repositories/Auth.repository')
const jwt = require('jsonwebtoken')
const RoleRepository = require('../repositories/Role.repository')

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
async function login(req, res, next) {
    try {
      const {userName, password} = req.body      
      const user = await AuthRepository.login(userName)
      const roles = await RoleRepository.getRoleNameByIds(user.roleId)
      if(!user) {
        Helper.sendFail(res, 404, "User name not found");
        return;
      }else{
        if(user.status === 'inactive') {
            Helper.sendFail(res, 401, "Your account is not active");
            return;
        }
        if(!bcrypt.compareSync(password, user.password)){
            Helper.sendFail(res, 400, "Password is not correct");
            return;
        }else{
          const accessToken = jwt.sign({id: user._id, roles: roles}, process.env.ACCESS_TOKEN_JWT_SECRET_KEY, {expiresIn: '60m'})
          const refreshToken = jwt.sign({id: user._id, roles: roles}, process.env.REFRESH_TOKEN_JWT_SECRET_KEY, {expiresIn: '30d'})
          res.cookie('accessToken', accessToken, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true 
          })
          res.cookie('refreshToken', refreshToken, {
            maxAge: 30*24*60*60*1000,
            httpOnly: true
          })
          Helper.sendSuccess(res, 200, {id: user._id, roles: roles, accessToken: accessToken, refreshToken: refreshToken}, "Login success");
          return;
        }
      }
    } catch (error) {
      next(error)
    }
  }

//logout function
async function logout(req, res, next) {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.status(200).json({message: 'Logout success'})
    } catch (error) {
      next(error)
    }
  }

//forgot password function
async function forgotPassword(req, res) {
}

const AuthController = { signup, login, forgotPassword, logout };
module.exports = AuthController;