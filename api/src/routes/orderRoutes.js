const express = require('express');
// mergeParams: true allows accessing the parent router's path parameters if nested in the future
const router = express.Router({ mergeParams: true });
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// grouping actions for the base path '/'
router.route('/')
    .get(authMiddleware, orderController.getUserOrders)  // Get all orders for the authenticated user
    .post(authMiddleware, orderController.createOrder);  // Create a new order

// Calculation route
router.post('/calculate', orderController.calculateOrder);

// grouping actions for the dynamic order path '/:id'
router.route('/:id')
    .get(authMiddleware, orderController.getOrderById)   // Get a specific order by its ID
    .patch(authMiddleware, orderController.updateOrder)  // Update a specific order's details by its ID
    .delete(authMiddleware, orderController.deleteOrder);// Delete a specific order by its ID

module.exports = router;
