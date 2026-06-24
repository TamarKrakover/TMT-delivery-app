const mongoose = require('mongoose');
const connectDB = require('./db');
const db = require('../models/InMemoryDB');

// Models
const UserModel = require('../models/UserModel');
const RestaurantModel = require('../models/RestaurantModel');
const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');
const OrderModel = require('../models/OrderModel');

const importData = async () => {
    try {
        await connectDB();
        
        console.log('Importing categories...');
        for (let cat of db.categories) {
            const exists = await CategoryModel.findOne({ name: cat.name });
            if (!exists) {
                await CategoryModel.create({ name: cat.name, image: cat.image });
            }
        }

        console.log('Importing users...');
        const userMap = new Map(); // Old ID -> New _id
        for (let user of db.users) {
            let existingUser = await UserModel.findOne({ username: user.username });
            if (!existingUser) {
                const newUser = new UserModel({
                    username: user.username,
                    password: user.password,
                    name: user.name,
                    role: user.role || 'customer',
                    isAdmin: user.isAdmin || false,
                    location: user.location,
                    profilePic: user.profilePic || null
                });
                existingUser = await newUser.save();
            }
            userMap.set(user.id, existingUser._id.toString());
        }

        console.log('Importing restaurants...');
        const restMap = new Map(); // Old ID -> New _id
        for (let rest of db.restaurants) {
            let existingRest = await RestaurantModel.findOne({ name: rest.name });
            if (!existingRest) {
                const newCreatorId = userMap.get(rest.creatorId) || rest.creatorId;
                const newRest = new RestaurantModel({
                    name: rest.name,
                    description: rest.description,
                    category: rest.category,
                    image: rest.image,
                    location: rest.location,
                    creatorId: newCreatorId
                });
                existingRest = await newRest.save();
            }
            restMap.set(rest.id, existingRest._id.toString());
        }

        console.log('Importing products...');
        const prodMap = new Map(); // Old ID -> New _id
        for (let prod of db.products) {
            let existingProd = await ProductModel.findOne({ name: prod.name });
            if (!existingProd) {
                const newRestId = restMap.get(prod.restaurantId) || prod.restaurantId;
                const newProd = new ProductModel({
                    restaurantId: newRestId,
                    name: prod.name,
                    description: prod.description,
                    price: prod.price,
                    image: prod.image
                });
                existingProd = await newProd.save();
            }
            prodMap.set(prod.id, existingProd._id.toString());
        }

        console.log('Importing orders...');
        for (let order of db.orders) {
            const newUserId = userMap.get(order.userId) || order.userId;
            const newRestId = restMap.get(order.restaurantId) || order.restaurantId;
            const newProductIds = (order.productIds || []).map(pid => prodMap.get(pid) || pid);
            
            const existingOrder = await OrderModel.findOne({
                userId: newUserId,
                restaurantId: newRestId,
                totalPrice: order.totalPrice
            });

            if (!existingOrder) {
                const newOrder = new OrderModel({
                    userId: newUserId,
                    restaurantId: newRestId,
                    productIds: newProductIds,
                    totalPrice: order.totalPrice,
                    status: order.status
                });
                await newOrder.save();
            }
        }

        console.log('Data Imported Successfully!');
        if (require.main === module) process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        if (require.main === module) process.exit(1);
    }
};

if (require.main === module) {
    importData();
}

module.exports = importData;
