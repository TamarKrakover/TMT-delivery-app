// Import the SearchModel to access the database search function
const SearchModel = require('../models/SearchModel');

/**
 * Handles the GET /api/search/:query endpoint.
 * Extracts the search query from the request parameters, calls the model,
 * and returns the search results in JSON format.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const search = async (req, res) => {
    // Extract query parameter from the URL path
    const query = req.params.query;
    
    try {
        // Perform search via SearchModel
        const results = await SearchModel.search(query);
        
        // Respond with status 200 and the list of matching items
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error during search' });
    }
};

module.exports = {
    search
};
