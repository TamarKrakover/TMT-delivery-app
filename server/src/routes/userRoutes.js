const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Group routes by path '/'
router.route('/')
    .post(userController.createUser); // Create new user

// Group routes by path '/:id'
router.route('/:id')
    .get(userController.getUserById); // Get a specific user by id

module.exports = router;

