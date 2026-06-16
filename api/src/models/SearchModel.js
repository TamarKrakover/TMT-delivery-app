// Import the centralized in-memory database
const db = require('./InMemoryDB');

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
    static search(query) {
        // Convert the search term to lowercase to facilitate case-insensitive comparison
        const lowerCaseQuery = query.toLowerCase();
        
        // Filter restaurants where the name or description contains the search query
        const matchedRestaurants = db.restaurants.filter(r => 
            (r.name && r.name.toLowerCase().includes(lowerCaseQuery)) || 
            (r.description && r.description.toLowerCase().includes(lowerCaseQuery))
        ).map(r => ({ ...r, type: 'restaurant' }));

        // Filter products where the name or description contains the search query
        const matchedProducts = db.products.filter(p => 
            (p.name && p.name.toLowerCase().includes(lowerCaseQuery)) || 
            (p.description && p.description.toLowerCase().includes(lowerCaseQuery))
        ).map(p => ({ ...p, type: 'product' }));

        // Return structured object containing matching restaurants and products
        return { restaurants: matchedRestaurants, products: matchedProducts };
    }
}

module.exports = SearchModel;
