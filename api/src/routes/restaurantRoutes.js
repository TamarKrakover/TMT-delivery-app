const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');

const productRoutes = require('./productRoutes');

// Group routes by path '/'
router.route('/')
    .get(restaurantController.getAllRestaurants) // Get all restaurants
    .post(authMiddleware, restaurantController.createRestaurant); // Create a new restaurant

const RecommendationServer = require('../services/recommendationServer');

// Route to fetch recommendations based on user and last viewed product
router.get('/recommendations', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { productId } = req.query;

    if (!productId) {
        return res.status(400).json({ error: 'productId query parameter is required' });
    }

    try {
        const recommendedProducts = await RecommendationServer.get(userId, productId);
        res.status(200).json(recommendedProducts);
    } catch (err) {
        console.error('Error fetching recommendations:', err);
        res.status(500).json({ error: 'Internal server error while fetching recommendations' });
    }
});

// Group routes by path '/:id'
router.route('/:id')
    .get(restaurantController.getRestaurantById) // Get a specific restaurant by ID
    .patch(authMiddleware, restaurantController.updateRestaurant) // Update a specific restaurant by ID
    .delete(authMiddleware, restaurantController.deleteRestaurant); // Delete a specific restaurant by ID

// Forward any request that targets products to the productRoutes file
router.use('/:id/products', productRoutes);

module.exports = router;
