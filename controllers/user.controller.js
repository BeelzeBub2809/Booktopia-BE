const mongoose = require('mongoose')

const UserRepository = require('../repositories/User.repository')
const RoleRepository = require('../repositories/Role.repository')

async function getAllUsers(req, res){
    try{
        const users = await UserRepository.getUsers();
        res.send(users);
    }catch(err){
        res.status(500).send({message: err});
    }
}

async function getUserById(req, res){
    try{
        const user = await UserRepository.getUserById(req.params.id);
        if(!user){
            res.status(404).send({message: "User not found"});
            return;
        }
        res.send(user);
    }catch(err){
        res.status(500).send({message: err});
    }
}

async function createUser(req, res){
    try{
        const user = await UserRepository.createUser(req.body);
        
        const role = await RoleRepository.getRoleByName(req.body.role);
        if(!role){
            res.status(404).send({message: "Role not found"});
            return;
        }

        const newUser = await UserRepository.updateUser(user._id, {
            roleId: role._id
        });

        res.status(201).send(user);
    }catch(err){
        res.status(500).send({message: err});
    }
}

async function updateUser(req, res){
    try{
        const user = await UserRepository.updateUser(req.params.id, req.body);
        if(!user){
            res.status(404).send({message: "User not found"});
            return;
        }
        res.send(user);
    }catch(err){
        res.status(500).send({message: err});
    }
}

async function deleteUser(req, res){
    try{
        const user = await UserRepository.deleteUser(req.params.id);
        if(!user){
            res.status(404).send({message: "User not found"});
            return;
        }
        res.send({message: "User was deleted successfully!"});
    }catch(err){
        res.status(500).send({message: err});
    }
}

const UserController = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
module.exports = UserController;