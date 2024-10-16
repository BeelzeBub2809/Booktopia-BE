const db = require('../models/index')
const mongoose = require('mongoose')

const UserRepository = require('../repositories/User.repository')
const RoleRepository = require('../repositories/Role.repository')

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

        let user = await UserRepository.createUser({
            userName: req.body.username,
            password: req.body.password
        });

        if(!user){
            res.status(500).send({ message: "Failed to create user" });
            return;
        }else{
            const role = await RoleRepository.getRoleByName("Customer");
            
            const newUser = await UserRepository.updateUser(user._id, {
                roleId: role._id
            });
        }
        res.send({ message: "User was registered successfully!" });
    }catch(err){
        res.status(500).send({message: err});
        return;
    }
}

//login function
async function login(req, res){
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            accessToken: token
        });
    });
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