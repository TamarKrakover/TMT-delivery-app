const express = require('express');
const router = express.Router();
// Import the search controller to bind routes to handlers
const searchController = require('../controllers/searchController');

// Route path group for '/api/search/:query'
router.route('/:query')
    .get(searchController.search); // Route GET request to search handler

module.exports = router;
