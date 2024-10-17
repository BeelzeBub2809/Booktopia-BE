const db = require('../models/index')
const mongoose = require('mongoose')

const UserRepository = require('../repositories/User.repository')
const RoleRepository = require('../repositories/Role.repository')
const CustomerRepository = require('../repositories/Customer.repository')
const bcrypt = require('bcrypt')

async function signup (req, res){
    try{
        //validate request
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ message: "Username and password are required!" });
        }

        // Validate password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return res.status(400).send({ message: "Password must be at least 8 characters long and contain at least one letter and one number." });
        }

        let user = await CustomerRepository.createAccount({
            userName: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8)
        });        

        if(!user){
            res.status(500).send({ message: "Failed to create user" });
            return;
        }
        res.send({ message: "User was registered successfully!" });
    }catch(err){
        res.status(500).send({message: err});
        return;
    }
}

//login function
async function login(req, res){
    try{
        //validate request
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ message: "Username and password are required!" });
        }

        const user = await UserRepository.checkValidUsernameAndPasword(req.body.username, bcrypt.hashSync(req.body.password, 8));
        if(!user){
            res.status(404).send({ message: "Invalid Username or Password" });
            return;
        }

        req.session.user = user;
        res.send({ message: "User was logged in successfully!" });
    }catch(err){
        res.status(500).send({message: err});
        return;
    }
}

//logout function
async function logout(req, res){
    req.session = null;
    res.status(200).send({ message: "You've been logged out!" });
}

//forgot password function
async function forgotPassword(req, res){
}

const AuthController = {signup,login,forgotPassword,logout};
module.exports = AuthController;