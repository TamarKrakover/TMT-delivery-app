const CategoryModel = require('../models/CategoryModel');

exports.getAll = (req, res) => {
    try {
        const categories = CategoryModel.getAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
