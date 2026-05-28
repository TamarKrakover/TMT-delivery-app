const Product = require('../models/Product');

// retrieve all products for a specific restaurant
exports.getRestaurantProducts = (req, res) => {
    const { id } = req.params;
    const products = Product.getAllByRestaurant(id);
    res.status(200).json(products);
};

// create a new product and link it to a restaurant
exports.addProductToRestaurant = (req, res) => {
    const { id } = req.params;

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
    const product = Product.findById(id, pId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
};   

// update an existing product's details
exports.updateProduct = (req, res) => {
    const { id, pId } = req.params;
    const updatedProduct = Product.update(id, pId, req.body);

    if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).end(); 
};

// remove a product from the database
exports.deleteProduct = (req, res) => {
    const { id, pId } = req.params;
    const isDeleted = Product.delete(id, pId);
 
    if (!isDeleted) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).end();
};   