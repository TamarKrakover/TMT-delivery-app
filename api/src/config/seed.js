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
        
        console.log('Clearing existing data...');
        await UserModel.deleteMany();
        await RestaurantModel.deleteMany();
        await ProductModel.deleteMany();
        await CategoryModel.deleteMany();
        await OrderModel.deleteMany();

        console.log('Importing categories...');
        for (let cat of db.categories) {
            await CategoryModel.create({ name: cat.name, image: cat.image });
        }

        console.log('Importing users...');
        const userMap = new Map(); // Old ID -> New _id
        for (let user of db.users) {
            const newUser = new UserModel({
                username: user.username,
                password: user.password,
                name: user.name,
                role: user.role || 'customer',
                isAdmin: user.isAdmin || false,
                location: user.location,
                profilePic: user.profilePic || null
            });
            const saved = await newUser.save();
            userMap.set(user.id, saved._id.toString());
        }

        console.log('Importing restaurants...');
        const restMap = new Map(); // Old ID -> New _id
        for (let rest of db.restaurants) {
            const newCreatorId = userMap.get(rest.creatorId) || rest.creatorId;
            const newRest = new RestaurantModel({
                name: rest.name,
                description: rest.description,
                category: rest.category,
                image: rest.image,
                location: rest.location,
                creatorId: newCreatorId
            });
            const saved = await newRest.save();
            restMap.set(rest.id, saved._id.toString());
        }

        console.log('Importing products...');
        const prodMap = new Map(); // Old ID -> New _id
        for (let prod of db.products) {
            const newRestId = restMap.get(prod.restaurantId) || prod.restaurantId;
            const newProd = new ProductModel({
                restaurantId: newRestId,
                name: prod.name,
                description: prod.description,
                price: prod.price,
                image: prod.image
            });
            const saved = await newProd.save();
            prodMap.set(prod.id, saved._id.toString());
        }

        console.log('Importing orders...');
        for (let order of db.orders) {
            const newUserId = userMap.get(order.userId) || order.userId;
            const newRestId = restMap.get(order.restaurantId) || order.restaurantId;
            const newProductIds = (order.productIds || []).map(pid => prodMap.get(pid) || pid);
            
            const newOrder = new OrderModel({
                userId: newUserId,
                restaurantId: newRestId,
                productIds: newProductIds,
                totalPrice: order.totalPrice,
                status: order.status
            });
            await newOrder.save();
        }

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

importData();
