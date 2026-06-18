const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');

const productRoutes = require('./productRoutes');
const RecommendationServer = require('../services/recommendationServer');
const db = require('../models/InMemoryDB');
const fs = require('fs');
const path = require('path');

// Group routes by path '/'
router.route('/')
    .get(restaurantController.getAllRestaurants) // Get all restaurants
    .post(authMiddleware, restaurantController.createRestaurant); // Create a new restaurant

// Route to fetch dynamic recommendations based on user's last viewed/ordered product
router.get('/recommendations', authMiddleware, async (req, res) => {
    const userId = req.userId;
    let targetProductId = null;

    try {
        const candidatePaths = [
            path.join(__dirname, '../../../data/data.txt'),
            path.join(__dirname, '../../data/data.txt'),
            '/app/data/data.txt'
        ];
        let filePath = null;
        for (const p of candidatePaths) {
            if (fs.existsSync(p)) {
                filePath = p;
                break;
            }
        }

        if (filePath) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');
            for (let i = lines.length - 1; i >= 0; i--) {
                const line = lines[i].trim();
                if (!line) continue;
                const parts = line.split(/\s+/);
                if (parts[0] === userId && parts.length > 1) {
                    targetProductId = parts[parts.length - 1];
                    break;
                }
            }
        }
    } catch (err) {
        console.error('Error reading data.txt:', err);
    }

    if (!targetProductId) {
        return res.status(200).json({ targetProductName: null, products: [] });
    }

    const product = db.products.find(p => p.id === targetProductId);
    const targetProductName = product ? product.name : null;

    try {
        const recommendedProducts = await RecommendationServer.get(userId, targetProductId);
        res.status(200).json({
            targetProductName,
            products: recommendedProducts
        });
    } catch (err) {
        console.error('Error in GET /recommendations:', err);
        res.status(500).json({ error: 'Internal server error' });
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
