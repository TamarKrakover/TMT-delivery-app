const db = require('./InMemoryDB');
const UserModel = require('./UserModel');
const RecommendationServer = require('../services/recommendationServer');
const crypto = require('crypto');

// generates a standard UUID for products
const generateProductId = () => {
    return crypto.randomUUID();
};

class ProductModel {
    // retrieves all products associated with a specific restaurant ID
    static getAllByRestaurant(restaurantId) {
        return db.products.filter(p => p.restaurantId === restaurantId);
    }

    static create(restaurantId, data) {
        const RestaurantModel = require('./RestaurantModel');
        const restaurant = RestaurantModel.findById(restaurantId);
        const category = restaurant ? restaurant.category.toLowerCase() : 'general';
        
        const newProduct = {
            id: generateProductId(),
            restaurantId: restaurantId,
            name: data.name,
            description: data.description || '',
            price: data.price,
            image: data.image || ''
        };
        db.products.push(newProduct);
        return newProduct;
    }

    // finds and returns a specific product by its ID and restaurant ID
    // if a userId is provided, logs the view to the recommendation server
    static findById(restaurantId, productId, userId = null) {
        const product = db.products.find(p => p.restaurantId === restaurantId && p.id === productId);
        
        if (product && userId) {
            RecommendationServer.save(userId, productId).catch(() => {});
        }
        
        return product;
    }

    // updates an existing product's fields while protecting its original IDs
    static update(restaurantId, productId, data) {
        const index = db.products.findIndex(p => p.restaurantId === restaurantId && p.id === productId);
        
        if (index === -1) return null;

        // merge old data with new data using the spread operator
        const updatedProduct = {
            ...db.products[index],
            ...data,
            id: productId, 
            restaurantId: restaurantId 
        };

        db.products[index] = updatedProduct;
        return updatedProduct;
    }

    // removes a product from the database array
    static delete(restaurantId, productId) {
        const index = db.products.findIndex(p => p.restaurantId === restaurantId && p.id === productId);
        
        if (index === -1) return false;

        db.products.splice(index, 1);
        return true;
    }
}

module.exports = ProductModel;
