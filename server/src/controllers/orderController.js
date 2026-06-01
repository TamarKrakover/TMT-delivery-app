const OrderModel = require('../models/OrderModel');
const UserModel = require('../models/UserModel');
const RecommendationServer = require('../services/recommendationServer');

// get all orders for the authenticated user
exports.getUserOrders = (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    const user = UserModel.findUserById(userId);
    if (!user) {
        return res.status(401).json({ error: 'User not found or invalid session' });
    }
    const userOrders = OrderModel.findByUserId(userId);
    res.status(200).json(userOrders);
};

// create a new order for the authenticated user
exports.createOrder = (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    const user = UserModel.findUserById(userId);
    if (!user) {
        return res.status(401).json({ error: 'User not found or invalid session' });
    }

    // validate required fields
    if (!req.body.restaurantId || !req.body.productIds || !Array.isArray(req.body.productIds)) {
        return res.status(400).json({ error: 'restaurantId and an array of productIds are required' });
    }

    // combine user ID with request data and create order
    const orderData = { ...req.body, userId: userId };
    const newOrder = OrderModel.create(orderData);

    // Notify recommendation server about the ordered products
    if (userId && req.body.productIds && req.body.productIds.length > 0) {
        RecommendationServer.save(userId, req.body.productIds);
    }

    // return 201 Created with the new resource location
    const resourceLocation = '/api/orders/' + newOrder.id;
    res.status(201).location(resourceLocation).end();
};

// retrieve a specific order by its ID
exports.getOrderById = (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    const user = UserModel.findUserById(userId);
    if (!user) {
        return res.status(401).json({ error: 'User not found or invalid session' });
    }

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
exports.updateOrder = async (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    const user = UserModel.findUserById(userId);
    if (!user) {
        return res.status(401).json({ error: 'User not found or invalid session' });
    }

    const order = OrderModel.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the order belongs to the user trying to update it
    if (order.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to update this order' });
    }

    const oldProductIds = order.productIds || [];
    const newProductIds = req.body.productIds;

    // If new products are provided and they differ, update the recommendation server
    if (newProductIds && Array.isArray(newProductIds)) {
        try {
            // 1. Delete all old products in this order from the C++ server
            if (oldProductIds.length > 0) {
                await RecommendationServer.delete(userId, oldProductIds);
            }
            // 2. Add all new products in this order to the C++ server
            if (newProductIds.length > 0) {
                await RecommendationServer.save(userId, newProductIds);
            }
        } catch (err) {
            // Silently ignore connection or C++ level errors to keep Express thread stable
        }
    }

    const updatedOrder = OrderModel.update(req.params.id, req.body);
    if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // 204 No Content on success
    res.status(204).end();
};

// delete an existing order by its ID
exports.deleteOrder = async (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    const user = UserModel.findUserById(userId);
    if (!user) {
        return res.status(401).json({ error: 'User not found or invalid session' });
    }

    const order = OrderModel.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the order belongs to the user trying to delete it
    if (order.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this order' });
    }

    // Send delete command to the C++ recommendation server
    if (order.productIds && order.productIds.length > 0) {
        try {
            await RecommendationServer.delete(userId, order.productIds);
        } catch (err) {
            // Silently ignore connection or C++ level errors to keep Express thread stable
        }
    }

    const isDeleted = OrderModel.delete(req.params.id);
    if (!isDeleted) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // 204 No Content on success
    res.status(204).end();
};