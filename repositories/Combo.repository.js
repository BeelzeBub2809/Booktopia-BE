const mongoose = require('mongoose');
const {Combo, Product} = require('../models');
const { uploadImage, deleteImages } = require('../extensions/uploadImage');

async function create({
        name,
        productId,
        price,
        discount=0,
        status='inactive',
        quantity= 0,
        image
    }) {
        for(proId of productId){
            if(!mongoose.Types.ObjectId.isValid(proId)){
                throw new Error('Invalid product id');
            }
            let product = await Product.findById(proId);
            if(!product){
                throw new Error('Product not found');
            }
            product.quantityInStock = product.quantityInStock - quantity;
            product.save();
        }
        const imageUrl = await uploadImage(image, name, 'combo');
        
        const combo = new Combo({
            name: name,
            productId: productId,
            price: price,
            discount: discount,
            status: status,
            quantity: quantity,
            image: imageUrl
        });
        return await combo.save();
    }

    async function findById(comboId) {
        return await Combo.findById(comboId).populate('productId');
    }

    async function findAll() {
        return await Combo.find();
    }

    async function update(comboId, {
        name,
        productId,
        price,
        discount,
        status,
        quantity,
        image
    }) {
        let combo = await Combo.findById(comboId);

        const oldProductList = combo.productId;
        const newProductList = productId??oldProductList;   
        const oldQuantity = parseInt(combo.quantity);
        const newQuantity = parseInt(quantity ?? oldQuantity);

        // Check if the new quantity is greater than the old quantity
        const diff = newQuantity - oldQuantity;

        //update product quantity
        for (proId of newProductList) {
            let product = await Product.findById(proId);
            if (!product) {
                throw new Error('Product not found');
            }
            if (!oldProductList.includes(proId)) {
                if (product.quantityInStock < newQuantity) {
                    throw new Error('Not enough stock');
                }
                product.quantityInStock -= newQuantity;
            } else {
                if (product.quantityInStock < diff) {
                    throw new Error('Not enough stock');
                }
                product.quantityInStock -= diff;
            }
            product.save();
        }

        const removedProducts = oldProductList.filter(proId => !newProductList.includes(proId.toString()));
        for (proId of removedProducts) {
            let product = await Product.findById(proId);
            if (!product) {
                throw new Error('Product not found');
            }
            product.quantityInStock += oldQuantity;
            product.save();
        }

        await deleteImages(combo.image);

        const newImageUrl = await uploadImage(image, name, 'combo');

        combo.name = name??combo.name;
        combo.productId = productId??combo.productId;
        combo.price = price??combo.price;
        combo.discount = discount??combo.discount;
        combo.status = status??combo.status;
        combo.quantity = quantity??combo.quantity;
        combo.image = newImageUrl;
        combo.save();

        return combo;
    }

    async function deleteCombo(comboId) {
        const combo = Combo.findById(comboId);
        for(proId of combo.productId){
            let product = await Product.findById(proId);
            product.quantityInStock += parseInt(combo.quantity);
            product.save();
        }

        return await Combo.findByIdAndDelete(comboId);
    }

    const ComboRepository = {
        create,
        findById,
        findAll,
        update,
        deleteCombo
    }

module.exports = ComboRepository;