const RestaurantModel = require('../models/RestaurantModel');
const UserModel = require('../models/UserModel');

// Fetch all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await RestaurantModel.getAll();
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
    // Authentication is handled by authMiddleware
    const userId = req.userId; 

    try {
        const user = await UserModel.findUserById(userId);
        if (!user || (user.role !== 'owner' && !user.isAdmin)) {
            return res.status(403).json({ error: 'Forbidden: Only restaurant owners can create restaurants' });
        }

        // Validate request
        if (!req.body.name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Pass data to the Model
        const newRestaurant = await RestaurantModel.create(req.body, userId);

        // Set the Location header pointing to the newly created resource
        const resourceLocation = '/api/restaurants/' + newRestaurant.id;

        // Return 201 status, set the Location header, and return the newly created restaurant as JSON
        res.status(201).location(resourceLocation).json(newRestaurant);
    } catch (error) {
        if (error.message === 'DUPLICATE_RESTAURANT' || error.code === 11000) {
            return res.status(409).json({ error: 'A restaurant with this name and address already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch a single restaurant by its ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await RestaurantModel.findById(req.params.id);

        // Handle case where the requested ID doesn't exist
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a restaurant
exports.updateRestaurant = async (req, res) => {
    // Authentication is handled by authMiddleware
    const userId = req.userId;
    try {
        const restaurant = await RestaurantModel.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const user = await UserModel.findUserById(userId);
        const isAdmin = user && user.isAdmin;

        if (restaurant.creatorId !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only the creator or an admin can modify this restaurant' });
        }

        // Pass the ID and the new data to Mongoose findByIdAndUpdate
        const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedRestaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(204).end();
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'A restaurant with this name and address already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
    // Authentication is handled by authMiddleware
    const userId = req.userId;

    try {
        const restaurant = await RestaurantModel.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const user = await UserModel.findUserById(userId);
        const isAdmin = user && user.isAdmin;

        if (restaurant.creatorId !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only the creator or an admin can modify this restaurant' });
        }

        // Attempt to delete via findOneAndDelete to trigger the Post Hook cascade delete
        const isDeleted = await RestaurantModel.findOneAndDelete({ _id: req.params.id });

        if (!isDeleted) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};