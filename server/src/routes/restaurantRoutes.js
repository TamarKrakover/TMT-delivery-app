const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');

const productRoutes = require('./productRoutes');

// Get all restaurants
// GET /api/restaurants
router.get('/', restaurantController.getAllRestaurants);

// Create a new restaurant
// POST /api/restaurants
router.post('/', restaurantController.createRestaurant);

// Get a specific restaurant by ID
// GET /api/restaurants/:id
router.get('/:id', restaurantController.getRestaurantById);

// Update a specific restaurant by ID
// PATCH /api/restaurants/:id
router.patch('/:id', restaurantController.updateRestaurant);

// Delete a specific restaurant by ID
// DELETE /api/restaurants/:id
router.delete('/:id', restaurantController.deleteRestaurant);

// Forward any request that targets products to the productRoutes file.
// The URL will look like: /api/restaurants/:id/products/...
router.use('/:id/products', productRoutes);

module.exports = router;
