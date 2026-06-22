const Product = require('../models/ProductModel');
const Restaurant = require('../models/RestaurantModel');
const UserModel = require('../models/UserModel');

// retrieve all products for a specific restaurant
exports.getRestaurantProducts = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const products = await Product.getAllByRestaurant(id);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// create a new product and link it to a restaurant
exports.addProductToRestaurant = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const user = await UserModel.findUserById(userId);
        const isAdmin = user && user.isAdmin;

        if (restaurant.creatorId !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only the creator or an admin can modify this restaurant' });
        }

        // validate required fields
        if (!req.body.name || req.body.price === undefined) {
            return res.status(400).json({ error: 'Name and price are required' });
        }
        if (typeof req.body.price !== 'number' || req.body.price < 0) {
            return res.status(400).json({ error: 'Price must be a positive number' });
        }

        const newProduct = await Product.create(id, req.body);
        const resourceLocation = `/api/restaurants/${id}/products/${newProduct.id}`;

        // return 201 Created with the new resource location and product as JSON
        res.status(201).location(resourceLocation).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// fetch a single product by its ID and restaurant ID
exports.getProductById = async (req, res) => {
    try {
        const { id, pId } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // get user ID from header for tracking (not authentication, as this is a public route)
        const userId = req.headers['x-user-id'];
        const product = await Product.findByIdWithLog(id, pId, userId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// update an existing product's details
exports.updateProduct = async (req, res) => {
    try {
        const userId = req.userId;
        const { id, pId } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const user = await UserModel.findUserById(userId);
        const isAdmin = user && user.isAdmin;

        if (restaurant.creatorId !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only the creator or an admin can modify this restaurant' });
        }

        if (req.body.price !== undefined && (typeof req.body.price !== 'number' || req.body.price < 0)) {
            return res.status(400).json({ error: 'Price must be a positive number' });
        }

        const updatedProduct = await Product.findOneAndUpdate({ _id: pId, restaurantId: id }, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// remove a product from the database
exports.deleteProduct = async (req, res) => {
    try {
        const userId = req.userId;
        const { id, pId } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const user = await UserModel.findUserById(userId);
        const isAdmin = user && user.isAdmin;

        if (restaurant.creatorId !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only the creator or an admin can modify this restaurant' });
        }

        const isDeleted = await Product.findOneAndDelete({ _id: pId, restaurantId: id });

        if (!isDeleted) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};