const mongoose = require('mongoose')

const UserRepository = require('../repositories/User.repository')
const RoleRepository = require('../repositories/Role.repository');
const Helper = require('../helper/helper');

async function getAllUsers(req, res){
    try{
        const users = await UserRepository.getUsers();
        Helper.sendSuccess(res, 200, users, "Users were fetched successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
    }
}

async function getUserById(req, res){
    try{
        const user = await UserRepository.getUserById(req.params.id);
        if(!user){
            Helper.sendFail(res, 404, "User not found");
            return;
        }
        Helper.sendSuccess(res, 200, user, "User was fetched successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
    }
}

async function createUser(req, res){
    try{
        const user = await UserRepository.createUser(req.body);
        
        const role = await RoleRepository.getRoleByName(req.body.role);
        if(!role){
            Helper.sendFail(res, 404, "Role not found");
            return;
        }

        const newUser = await UserRepository.updateUser(user._id, {
            roleId: role._id
        });

        Helper.sendSuccess(res, 200, newUser, "User was created successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
    }
}

async function updateUser(req, res){
    try{
        const user = await UserRepository.updateUser(req.params.id, req.body);
        if(!user){
            Helper.sendFail(res, 404, "User not found");
            return;
        }
        Helper.sendSuccess(res, 200, user, "User was updated successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
    }
}

async function deleteUser(req, res){
    try{
        const user = await UserRepository.deleteUser(req.params.id);
        if(!user){
            Helper.sendFail(res, 404, "User not found");
            return;
        }
        Helper.sendSuccess(res, 200, user, "User was deleted successfully!");
    }catch(err){
        Helper.sendFail(res, 500, err.message);
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