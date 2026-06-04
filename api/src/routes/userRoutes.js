const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Group routes by path '/'
router.route('/')
    .post(userController.createUser); // Create new user

// Group routes by path '/:id'
router.route('/:id')
    .get(authMiddleware, userController.getUserById); // Get a specific user by id

module.exports = router;

