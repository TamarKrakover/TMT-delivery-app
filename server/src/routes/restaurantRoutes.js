const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');

const productRoutes = require('./productRoutes');

// Group routes by path '/'
router.route('/')
    .get(restaurantController.getAllRestaurants) // Get all restaurants
    .post(restaurantController.createRestaurant); // Create a new restaurant

// Group routes by path '/:id'
router.route('/:id')
    .get(restaurantController.getRestaurantById) // Get a specific restaurant by ID
    .patch(restaurantController.updateRestaurant) // Update a specific restaurant by ID
    .delete(restaurantController.deleteRestaurant); // Delete a specific restaurant by ID

// Forward any request that targets products to the productRoutes file
router.use('/:id/products', productRoutes);

module.exports = router;
