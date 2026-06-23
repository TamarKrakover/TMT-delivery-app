const RestaurantModel = require('./RestaurantModel');
const ProductModel = require('./ProductModel');

/**
 * SearchModel class handles the database querying logic for the search functionality.
 */
class SearchModel {
    /**
     * Searches for restaurants and products matching a query string.
     * A match is found if the query matches (case-insensitively) the name or description of either a restaurant or a product.
     * 
     * @param {string} query - The search search term.
     * @returns {Array} An array of matched restaurant and product objects.
     */
    static async search(query) {
        if (!query) return [];

        // Convert the search term to lowercase to facilitate case-insensitive comparison
        const regex = new RegExp(query, 'i');

        // Filter restaurants where the name or description contains the search query
        const matchedRestaurants = await RestaurantModel.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        });

        // Filter products where the name or description contains the search query
        const matchedProducts = await ProductModel.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        });

        // Combine and return the matching restaurants and products
        return [...matchedRestaurants, ...matchedProducts];
    }
}

module.exports = SearchModel;
