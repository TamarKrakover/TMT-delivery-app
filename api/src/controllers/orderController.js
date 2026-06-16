const OrderModel = require('../models/OrderModel');
const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');

// get all orders for the authenticated user
exports.getUserOrders = (req, res) => {
    const userId = req.userId;
    const userOrders = OrderModel.findByUserId(userId);
    res.status(200).json(userOrders);
};

// create a new order for the authenticated user
exports.createOrder = (req, res) => {
    const userId = req.userId;

    // validate required fields
    if (!req.body.restaurantId || !req.body.productIds || !Array.isArray(req.body.productIds) || req.body.productIds.length === 0) {
        return res.status(400).json({ error: 'restaurantId and a non-empty array of productIds are required' });
    }

    // Verify all products belong to the restaurant
    const allValid = req.body.productIds.every(pid => {
        const product = ProductModel.findById(req.body.restaurantId, pid);
        return product !== undefined;
    });

    if (!allValid) {
        return res.status(400).json({ error: 'One or more products do not exist or do not belong to this restaurant' });
    }

    // combine user ID with request data and create order
    const orderData = { ...req.body, userId: userId };
    const newOrder = OrderModel.create(orderData);

    // return 201 Created with the new resource location
    const resourceLocation = '/api/orders/' + newOrder.id;
    res.status(201).location(resourceLocation).end();
};

// retrieve a specific order by its ID
exports.getOrderById = (req, res) => {
    const userId = req.userId;

    const order = OrderModel.findById(req.params.id);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the order belongs to the user trying to view it
    if (order.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to view this order' });
    }
    
    res.status(200).json(order);
};

// update an existing order by its ID
exports.updateOrder = (req, res) => {
    const userId = req.userId;

    const order = OrderModel.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the order belongs to the user trying to update it
    if (order.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to update this order' });
    }

    // totalPrice and status are securely managed by the server, 
    // productIds is the only valid field a user can update
    if (!req.body.productIds || !Array.isArray(req.body.productIds) || req.body.productIds.length === 0) {
        return res.status(400).json({ error: 'A non-empty array of productIds is required to update an order' });
    }

    // Verify all products belong to the restaurant
    const allValid = req.body.productIds.every(pid => {
        const product = ProductModel.findById(order.restaurantId, pid);
        return product !== undefined;
    });

    if (!allValid) {
        return res.status(400).json({ error: 'One or more products do not exist or do not belong to this restaurant' });
    }

    const updatedOrder = OrderModel.update(req.params.id, req.body);
    if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // 204 No Content on success
    res.status(204).end();
};

// delete an existing order by its ID
exports.deleteOrder = (req, res) => {
    const userId = req.userId;

    const order = OrderModel.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the order belongs to the user trying to delete it
    if (order.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this order' });
    }

    const isDeleted = OrderModel.delete(req.params.id);
    if (!isDeleted) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // 204 No Content on success
    res.status(204).end();
};

// calculate order totals based on an array of productIds
exports.calculateOrder = (req, res) => {
    // validate required fields
    if (!req.body.restaurantId || !req.body.productIds || !Array.isArray(req.body.productIds)) {
        return res.status(400).json({ error: 'restaurantId and an array of productIds are required' });
    }

    let calculatedTotal = 0;
    const items = [];

    // Map each productId to the actual product and calculate price
    req.body.productIds.forEach(pid => {
        const product = ProductModel.findById(req.body.restaurantId, pid);
        if (product) {
            calculatedTotal += product.price || 0;
            items.push(product);
        }
    });

    res.status(200).json({
        totalPrice: calculatedTotal,
        items: items
    });
};