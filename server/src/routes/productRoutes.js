const express = require('express');
// mergeParams: true allows accessing the parent router's path parameters (like restaurant :id)
const router = express.Router({ mergeParams: true });
const productController = require('../controllers/productController');

// get all products for a specific restaurant
router.get('/', productController.getRestaurantProducts);

// add a new product to a specific restaurant
router.post('/', productController.addProductToRestaurant);

// get a specific product by its ID
router.get('/:pId', productController.getProductById);

// update a specific product's details by its ID
router.patch('/:pId', productController.updateProduct);

// Delete a specific product from a restaurant by its ID
router.delete('/:pId', productController.deleteProduct);

module.exports = router;