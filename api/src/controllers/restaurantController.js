const RestaurantModel = require('../models/RestaurantModel');
const UserModel = require('../models/UserModel');
const { calculateDistance } = require('../utils/distance');

// Fetch all restaurants
exports.getAllRestaurants = (req, res) => {
    let restaurants = RestaurantModel.getAll();
    const { lat, lng } = req.query;

    if (lat !== undefined && lng !== undefined) {
        const userLoc = { lat: parseFloat(lat), lng: parseFloat(lng) };
        restaurants = restaurants.map(r => {
            const distance = r.location ? calculateDistance(userLoc, r.location) : null;
            return { ...r, distance };
        });
        restaurants.sort((a, b) => {
            if (a.distance === null && b.distance === null) return 0;
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
    }
    res.status(200).json(restaurants);
};

// Create a new restaurant
exports.createRestaurant = (req, res) => {
    // Authentication is handled by authMiddleware
    const userId = req.userId; // Provided by authMiddleware

    const user = UserModel.findUserById(userId);
    if (!user || (user.role !== 'owner' && !user.isAdmin)) {
        return res.status(403).json({ error: 'Forbidden: Only restaurant owners can create restaurants' });
    }

    // Validate request
    if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    // Pass data to the Model
    try {
        const newRestaurant = RestaurantModel.create(req.body, userId);

        // Set the Location header pointing to the newly created resource
        const resourceLocation = '/api/restaurants/' + newRestaurant.id;

        // Return 201 status, set the Location header, and return the newly created restaurant as JSON
        res.status(201).location(resourceLocation).json(newRestaurant);
    } catch (error) {
        if (error.message === 'DUPLICATE_RESTAURANT') {
            return res.status(409).json({ error: 'A restaurant with this name and address already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch a single restaurant by its ID
exports.getRestaurantById = (req, res) => {
    const restaurant = RestaurantModel.findById(req.params.id);

    // Handle case where the requested ID doesn't exist
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
};

// Update a restaurant
exports.updateRestaurant = (req, res) => {
    // Authentication is handled by authMiddleware
    const userId = req.userId;
    
    const restaurant = RestaurantModel.findById(req.params.id);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    const user = UserModel.findUserById(userId);
    const isAdmin = user && user.isAdmin;

    if (restaurant.creatorId !== userId && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Only the creator or an admin can modify this restaurant' });
    }

    try {
        // Pass the ID and the new data to the model
        const updatedRestaurant = RestaurantModel.update(req.params.id, req.body);

        if (!updatedRestaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.status(204).end();
    } catch (error) {
        if (error.message === 'DUPLICATE_RESTAURANT') {
            return res.status(409).json({ error: 'A restaurant with this name and address already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a restaurant
exports.deleteRestaurant = (req, res) => {
    // Authentication is handled by authMiddleware
    const userId = req.userId;

    const restaurant = RestaurantModel.findById(req.params.id);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    const user = UserModel.findUserById(userId);
    const isAdmin = user && user.isAdmin;

    if (restaurant.creatorId !== userId && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Only the creator or an admin can modify this restaurant' });
    }

    // Attempt to delete via the model
    const isDeleted = RestaurantModel.delete(req.params.id);

    if (!isDeleted) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(204).end();
};