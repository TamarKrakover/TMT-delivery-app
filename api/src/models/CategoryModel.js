const mongoose = require('mongoose');
const RestaurantModel = require('./RestaurantModel');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, default: "/api/uploads/categories/all.webp" }
}, {
    timestamps: true
});

categorySchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// Retrieve all categories, computing the restaurant count for each
categorySchema.statics.getAll = async function() {
    const categories = await this.find().lean();
    
    const result = [];
    for (let cat of categories) {
        const count = await RestaurantModel.countDocuments({ 
            category: { $regex: new RegExp(`^${cat.name}$`, 'i') } 
        });
        
        cat.id = cat._id.toString();
        delete cat._id;
        delete cat.__v;
        cat.count = count;
        result.push(cat);
    }
    return result;
};

// Create a new category
categorySchema.statics.create = async function(data) {
    // Enforce uniqueness of name (case-insensitive)
    const isDuplicate = await this.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') } });
    if (isDuplicate) {
        throw new Error('DUPLICATE_CATEGORY');
    }
    const category = new this({
        name: data.name,
        image: data.image
    });
    const saved = await category.save();
    const doc = saved.toJSON();
    doc.count = 0;
    return doc;
};

const CategoryModel = mongoose.model('Category', categorySchema);
module.exports = CategoryModel;
