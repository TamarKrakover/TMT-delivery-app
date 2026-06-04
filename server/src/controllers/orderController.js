const OrderModel = require('../models/OrderModel');
const UserModel = require('../models/UserModel');

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
    if (!req.body.restaurantId || !req.body.productIds || !Array.isArray(req.body.productIds)) {
        return res.status(400).json({ error: 'restaurantId and an array of productIds are required' });
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

    // Since totalPrice and status are securely managed by the server, 
    // productIds is the only valid field a user can update.
    if (!req.body.productIds || !Array.isArray(req.body.productIds)) {
        return res.status(400).json({ error: 'An array of productIds is required to update an order' });
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