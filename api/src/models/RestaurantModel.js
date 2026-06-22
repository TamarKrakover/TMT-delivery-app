const mongoose = require('mongoose');
const ProductModel = require('./ProductModel');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    image: { type: String, default: '/api/uploads/restaurants/default.webp' },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    creatorId: { type: String, required: true }
}, {
    timestamps: true
});

// Automatically transform _id to id when sending to client
restaurantSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// Remove all products associated with this restaurant to prevent memory leaks (zombie products)
restaurantSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await mongoose.model('Product').deleteMany({ restaurantId: doc._id });
    }
});

// Retrieve all restaurants from the database
restaurantSchema.statics.getAll = function() {
    return this.find();
};

// Create a new restaurant with creatorId constraint
restaurantSchema.statics.create = async function(data, creatorId) {
    // Enforce uniqueness of name
    if (await this.findOne({ name: data.name })) {
        throw new Error('DUPLICATE_RESTAURANT');
    }
    const restaurant = new this({ ...data, creatorId });
    return restaurant.save();
};

const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);
module.exports = RestaurantModel;