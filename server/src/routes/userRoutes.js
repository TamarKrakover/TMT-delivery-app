const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Create new user
// POST /api/users
router.post('/', userController.createUser);

// Get a spesipic user by id
// GET /api/users/:id
router.get('/:id', userController.getUserById)

module.exports = router;

