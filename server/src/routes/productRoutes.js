const express = require('express');
// mergeParams: true allows accessing the parent router's path parameters (like restaurant :id)
const router = express.Router({ mergeParams: true });
const productController = require('../controllers/productController');

// grouping actions for the base path '/'
router.route('/')
    .get(productController.getRestaurantProducts)  // Get all products for a specific restaurant
    .post(productController.addProductToRestaurant); // Add a new product to a specific restaurant

// grouping actions for the dynamic product path '/:pId'
router.route('/:pId')
    .get(productController.getProductById)         // Get a specific product by its ID
    .patch(productController.updateProduct)        // Update a specific product's details by its ID
    .delete(productController.deleteProduct);      // Delete a specific product from a restaurant by its ID

module.exports = router;