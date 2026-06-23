const ProductModel = require('../models/ProductModel');
const RestaurantModel = require('../models/RestaurantModel');
const RecommendationServer = require('../services/recommendationServer');

/**
 * Fetch recommendations for a user based on target product.
 * Returns an array of { product, restaurant } objects.
 */
const getRecommendations = async (req, res) => {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'userId and productId parameters are required' });
    }

    try {
        const responseString = await RecommendationServer.get(userId, productId);
        const results = [];
        
        if (responseString) {
            const productIds = responseString.split(/\s+/).filter(id => id.length > 0);
            for (const pid of productIds) {
                const product = await ProductModel.findByGlobalId(pid);
                if (product) {
                    const restaurant = await RestaurantModel.findById(product.restaurantId);
                    results.push({
                        product,
                        restaurant: restaurant || null
                    });
                }
            }
        }
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Internal server error while fetching recommendations' });
    }
};

module.exports = {
    getRecommendations
};
