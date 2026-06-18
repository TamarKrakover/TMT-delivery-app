const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(authMiddleware, createCategory);

module.exports = router;
