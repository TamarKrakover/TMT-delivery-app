const express = require('express');
// mergeParams: true allows accessing the parent router's path parameters (like restaurant :id)
const router = express.Router({ mergeParams: true });
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

// grouping actions for the base path '/'
router.route('/')
    .get(productController.getRestaurantProducts)  // Get all products for a specific restaurant
    .post(authMiddleware, productController.addProductToRestaurant); // Add a new product to a specific restaurant

// grouping actions for the dynamic product path '/:pId'
router.route('/:pId')
    .get(productController.getProductById)         // Get a specific product by its ID
    .patch(authMiddleware, productController.updateProduct)        // Update a specific product's details by its ID
    .delete(authMiddleware, productController.deleteProduct);      // Delete a specific product from a restaurant by its ID

module.exports = router;