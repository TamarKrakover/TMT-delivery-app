const express = require('express');
const router = express.Router();

const tokenController = require('../controllers/tokenController');

// Group routes by path '/'
router.route('/')
    .post(tokenController.createToken); // Create a new token (Login)

module.exports = router;