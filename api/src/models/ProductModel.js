const mongoose = require('mongoose');
const RecommendationServer = require('../services/recommendationServer');

const productSchema = new mongoose.Schema({
    restaurantId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    image: { type: String, default: '' }
}, {
    timestamps: true
});

// Automatically transform _id to id when sending to client
productSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// retrieves all products associated with a specific restaurant ID
productSchema.statics.getAllByRestaurant = function(restaurantId) {
    return this.find({ restaurantId });
};

// Create a new product
productSchema.statics.create = function(restaurantId, data) {
    const product = new this({
        restaurantId,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image
    });
    return product.save();
};

// finds and returns a specific product by its ID and restaurant ID
// if a userId is provided, logs the view to the recommendation server and updates user's last viewed product
productSchema.statics.findByIdWithLog = async function(restaurantId, productId, userId = null) {
    const product = await this.findOne({ restaurantId, _id: productId });
    
    if (product && userId) {
        RecommendationServer.save(userId, productId).catch(() => {});
        const UserModel = require('./UserModel');
        await UserModel.updateLastViewedProduct(userId, productId);
    }
    
    return product;
};

// finds and returns a specific product by its global ID across all restaurants
productSchema.statics.findByGlobalId = function(productId) {
    return this.findById(productId);
};

const ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;
