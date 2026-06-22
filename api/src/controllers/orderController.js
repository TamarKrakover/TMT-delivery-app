const OrderModel = require('../models/OrderModel');
const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');

// get all orders for the authenticated user
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const userOrders = await OrderModel.findByUserId(userId);
        res.status(200).json(userOrders);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// create a new order for the authenticated user
exports.createOrder = async (req, res) => {
    try {
        const userId = req.userId;

        // validate required fields
        if (!req.body.restaurantId || !req.body.productIds || !Array.isArray(req.body.productIds) || req.body.productIds.length === 0) {
            return res.status(400).json({ error: 'restaurantId and a non-empty array of productIds are required' });
        }

        // Verify all products belong to the restaurant
        const validProducts = await ProductModel.find({
            restaurantId: req.body.restaurantId,
            _id: { $in: req.body.productIds }
        });

        // The number of valid products might not match exactly if there are duplicates in the request array
        // We just need to make sure every ID in productIds exists in validProducts
        const validProductIds = validProducts.map(p => p.id || p._id.toString());
        const allValid = req.body.productIds.every(pid => validProductIds.includes(pid));

        if (!allValid) {
            return res.status(400).json({ error: 'One or more products do not exist or do not belong to this restaurant' });
        }

        // combine user ID with request data and create order
        const orderData = { ...req.body, userId: userId };
        const newOrder = await OrderModel.createOrder(orderData);

        // return 201 Created with the new resource location
        const resourceLocation = '/api/orders/' + newOrder.id;
        res.status(201).location(resourceLocation).end();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// retrieve a specific order by its ID
exports.getOrderById = async (req, res) => {
    try {
        const userId = req.userId;
        const order = await OrderModel.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Ensure the order belongs to the user trying to view it
        if (order.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to view this order' });
        }
        
        // Return recalculated order using the schema's _recalculatePrice method
        const recalculated = await OrderModel._recalculatePrice(order);
        res.status(200).json(recalculated);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// update an existing order by its ID
exports.updateOrder = async (req, res) => {
    try {
        const userId = req.userId;

        const order = await OrderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Ensure the order belongs to the user trying to update it
        if (order.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to update this order' });
        }

        // status and productIds are the valid fields a user can update
        const isStatusUpdateOnly = req.body.status && !req.body.productIds;

        if (!isStatusUpdateOnly && (!req.body.productIds || !Array.isArray(req.body.productIds) || req.body.productIds.length === 0)) {
            return res.status(400).json({ error: 'A non-empty array of productIds is required to update an order' });
        }

        if (!isStatusUpdateOnly) {
            // Verify all products belong to the restaurant
            const validProducts = await ProductModel.find({
                restaurantId: order.restaurantId,
                _id: { $in: req.body.productIds }
            });

            const validProductIds = validProducts.map(p => p.id || p._id.toString());
            const allValid = req.body.productIds.every(pid => validProductIds.includes(pid));

            if (!allValid) {
                return res.status(400).json({ error: 'One or more products do not exist or do not belong to this restaurant' });
            }
        }

        const updatedOrder = await OrderModel.updateOrder(req.params.id, req.body);
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // 204 No Content on success
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// delete an existing order by its ID
exports.deleteOrder = async (req, res) => {
    try {
        const userId = req.userId;

        const order = await OrderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Ensure the order belongs to the user trying to delete it
        if (order.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this order' });
        }

        const isDeleted = await OrderModel.deleteOrder(req.params.id);
        if (!isDeleted) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // 204 No Content on success
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// calculate order totals based on an array of productIds
exports.calculateOrder = async (req, res) => {
    try {
        // validate required fields
        if (!req.body.restaurantId || !req.body.productIds || !Array.isArray(req.body.productIds)) {
            return res.status(400).json({ error: 'restaurantId and an array of productIds are required' });
        }

        let calculatedTotal = 0;
        const items = [];

        // Map each productId to the actual product and calculate price
        const products = await ProductModel.find({
            restaurantId: req.body.restaurantId,
            _id: { $in: req.body.productIds }
        });

        req.body.productIds.forEach(pid => {
            const product = products.find(p => (p.id || p._id.toString()) === pid);
            if (product) {
                calculatedTotal += product.price || 0;
                items.push(product);
            }
        });

        res.status(200).json({
            totalPrice: calculatedTotal,
            items: items
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};