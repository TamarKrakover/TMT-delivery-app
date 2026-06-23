const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'customer' },
    isAdmin: { type: Boolean, default: false },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    profilePic: { type: String, default: null },
    lastViewedProduct: { type: String, default: null }
}, {
    timestamps: true
});

// Automatically transform _id to id when sending to client
userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// Create a new user
userSchema.statics.create = async function(data) {
    // Check if the username is already taken
    if (await this.findByUsername(data.username)) {
        throw new Error('Username already exists');
    }
    const user = new this(data);
    return user.save();
};

// Retrieve a user by their exact username
userSchema.statics.findByUsername = function(username) {
    return this.findOne({ username });
};

// Find a user by ID
userSchema.statics.findUserById = function(id) {
    return this.findById(id);
};

// Find a user by both username and password
userSchema.statics.findByCredentials = function(username, password) {
    return this.findOne({ username, password });
};

// Update the user's last viewed product
userSchema.statics.updateLastViewedProduct = async function(userId, productId) {
    const user = await this.findById(userId);
    if (user) {
        user.lastViewedProduct = productId;
        await user.save();
        return user;
    }
    return null;
};

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;