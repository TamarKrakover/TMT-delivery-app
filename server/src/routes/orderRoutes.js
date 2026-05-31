const express = require('express');
// mergeParams: true allows accessing the parent router's path parameters if nested in the future
const router = express.Router({ mergeParams: true });
const orderController = require('../controllers/orderController');

// grouping actions for the base path '/'
router.route('/')
    .get(orderController.getUserOrders)  // Get all orders for the authenticated user
    .post(orderController.createOrder);  // Create a new order

// grouping actions for the dynamic order path '/:id'
router.route('/:id')
    .get(orderController.getOrderById)   // Get a specific order by its ID
    .patch(orderController.updateOrder)  // Update a specific order's details by its ID
    .delete(orderController.deleteOrder);// Delete a specific order by its ID

module.exports = router;
