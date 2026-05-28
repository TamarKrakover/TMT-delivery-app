const express = require('express');
const router = express.Router();

const tokenController = require('../controllers/tokenController');

// Create a new token (Login)
// POST /api/tokens
router.post('/', tokenController.createToken);

module.exports = router;