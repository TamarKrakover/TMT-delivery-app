const RestaurantModel = require('../models/RestaurantModel');
const UserModel = require('../models/UserModel');

// Fetch all restaurants
exports.getAllRestaurants = (req, res) => {
    const restaurants = RestaurantModel.getAll();
    res.status(200).json(restaurants);
};

// Create a new restaurant
exports.createRestaurant = (req, res) => {
    // Authentication is handled by authMiddleware

    // Validate request
    if (!req.body.name || !req.body.address) {
        return res.status(400).json({ error: 'Name and address are required' });
    }

    // Pass data to the Model to do the heavy lifting
    const newRestaurant = RestaurantModel.create(req.body);

    // Set the Location header pointing to the newly created resource
    const resourceLocation = '/api/restaurants/' + newRestaurant.id;

    // Return 201 status, set the Location header, and end the response with no body
    res.status(201).location(resourceLocation).end();
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

    // Pass the ID and the new data to the model
    const updatedRestaurant = RestaurantModel.update(req.params.id, req.body);

    if (!updatedRestaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(204).end();
};

// Delete a restaurant
exports.deleteRestaurant = (req, res) => {
    // Authentication is handled by authMiddleware

    // Attempt to delete via the model
    const isDeleted = RestaurantModel.delete(req.params.id);

    if (!isDeleted) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(204).end();
};