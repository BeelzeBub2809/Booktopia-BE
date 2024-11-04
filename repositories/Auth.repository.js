const bcrypt = require('bcrypt');
const DBUser = require('../models/DBUser');
const DBCustomer = require('../models/DBCustomer');
const DBRole = require('../models/DBRole');
const Helper = require('../helper/helper');

async function registerUser({ userName, password, DOB, fullName, address, email, phone, status, gender, roles, image }) {
  // Hash the password before storing it
  const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.HASH_PASSWORD));
  console.log("Roles being assigned:", roles);

  // Create a new user instance
  const User = new DBUser({
    userName: userName,
    password: hashedPassword,
    DOB: DOB || null,
    fullName: fullName || "",
    address: address || null,
    email: email,
    phone: phone,
    status: status || "active",
    gender: gender || null,
    image: image || null
  });

  if (roles) {
    const currentRole = await DBRole.find({ _id: { $in: roles } }).exec();
    User.roleId = currentRole.map(r => r._id);
  } else {
    const defaultRole = await DBRole.findOne({ role: 'customer' }).exec();
    User.roleId = defaultRole._id;
  }

  try {
    const newUser = await DBUser.create(User);

    const customerProfile = new DBCustomer({
      userId: newUser._id,
      shipAddress: newUser.address || []
    });

    await DBCustomer.create(customerProfile);

    return newUser;
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique constraint error
      const field = Object.keys(error.keyValue)[0]; // Get the field that caused the error
      let message;

      switch (field) {
        case 'userName':
          message = 'Username is already taken.';
          break;
        case 'email':
          message = 'Email is already in use.';
          break;
        case 'phone':
          message = 'Phone number is already in use.';
          break;
        default:
          message = 'Duplicate value found.';
      }

      throw new Error(message);
    } else {
      throw new Error(error.message); // Re-throw other errors
    }
  }
}


async function login (userName){
  try {
    const user = await DBUser.findOne({userName: userName}).exec();
    return user;
  } catch (error) {
    Helper.sendFail(res, 500, error.message);
    return;
  }
}

const AuthRepository = {
  registerUser, login
};
module.exports = AuthRepository;