const CategoryModel = require('../models/CategoryModel');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = (req, res) => {
    try {
        const categories = CategoryModel.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Admin Only)
const createCategory = (req, res) => {
    const { name, image } = req.body;
    const user = req.user; // Set by protect middleware

    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized as an admin' });
    }

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const newCategory = CategoryModel.create({ name, image });
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.message === 'DUPLICATE_CATEGORY') {
            res.status(400).json({ message: 'Category already exists' });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

module.exports = {
    getCategories,
    createCategory
};
