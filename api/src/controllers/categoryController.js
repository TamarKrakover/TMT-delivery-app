const CategoryModel = require('../models/CategoryModel');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Admin Only)
const createCategory = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ error: 'Only admins can create categories' });
        }
        if (!req.body.name) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        const newCat = await CategoryModel.create(req.body);
        res.status(201).json(newCat);
    } catch (err) {
        if (err.message === 'DUPLICATE_CATEGORY') {
            res.status(400).json({ error: `The category "${req.body.name}" already exists.` });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = {
    getCategories,
    createCategory
};
