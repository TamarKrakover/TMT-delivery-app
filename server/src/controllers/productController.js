const Product = require('../models/ProductModel');
const Restaurant = require('../models/RestaurantModel');
const UserModel = require('../models/UserModel');

// retrieve all products for a specific restaurant
exports.getRestaurantProducts = (req, res) => {
    const { id } = req.params;

    // Check if the restaurant exists
    const restaurant = Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    const products = Product.getAllByRestaurant(id);
    res.status(200).json(products);
};

// create a new product and link it to a restaurant
exports.addProductToRestaurant = (req, res) => {
    const userId = req.userId;

    const { id } = req.params;

    // Check if the restaurant exists
    const restaurant = Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    // validate required fields
    if (!req.body.name || req.body.price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = Product.create(id, req.body);
    const resourceLocation = `/api/restaurants/${id}/products/${newProduct.id}`;

    // return 201 Created with the new resource location
    res.status(201).location(resourceLocation).end();
};

// fetch a single product by its ID and restaurant ID
exports.getProductById = (req, res) => {
    const { id, pId } = req.params;

    // Check if the restaurant exists
    const restaurant = Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    const userId = req.headers['x-user-id'];
    const product = Product.findById(id, pId, userId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
};

// update an existing product's details
exports.updateProduct = (req, res) => {
    const userId = req.userId;

    const { id, pId } = req.params;

    // Check if the restaurant exists
    const restaurant = Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    const updatedProduct = Product.update(id, pId, req.body);
    if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).end();
};

// remove a product from the database
exports.deleteProduct = (req, res) => {
    const userId = req.userId;

    const { id, pId } = req.params;

    // Check if the restaurant exists
    const restaurant = Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }

    const isDeleted = Product.delete(id, pId);

    if (!isDeleted) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).end();
};   