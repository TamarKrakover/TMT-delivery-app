const mongoose = require('mongoose');
const RecommendationServer = require('../services/recommendationServer');
const ProductModel = require('./ProductModel');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    productIds: [{ type: String }],
    totalPrice: { type: Number, default: 0 },
    status: { type: String, default: 'Pending' }
}, {
    timestamps: true
});

orderSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// dynamically recalculate the current total price of an order
orderSchema.statics._recalculatePrice = async function(orderDoc) {
    if (!orderDoc || !orderDoc.productIds) return orderDoc;
    let calculatedTotal = 0;
    
    // We fetch all products at once to be more efficient
    const products = await ProductModel.find({
        restaurantId: orderDoc.restaurantId,
        _id: { $in: orderDoc.productIds }
    });
    
    products.forEach(product => {
        if (product && product.price) {
            calculatedTotal += product.price;
        }
    });
    
    orderDoc.totalPrice = calculatedTotal;
    return orderDoc;
};

// retrieves all orders from the database
orderSchema.statics.getAll = async function() {
    const orders = await this.find();
    const result = [];
    for (let o of orders) {
        result.push(await this._recalculatePrice(o));
    }
    return result;
};

// creates a new order with default values for missing fields
orderSchema.statics.createOrder = async function(data) {
    let calculatedTotal = 0;
    if (data.productIds && Array.isArray(data.productIds)) {
        const products = await ProductModel.find({
            restaurantId: data.restaurantId,
            _id: { $in: data.productIds }
        });
        products.forEach(p => {
            if (p && p.price) {
                calculatedTotal += p.price;
            }
        });
    }

    const order = new this({
        userId: data.userId,
        restaurantId: data.restaurantId,
        productIds: data.productIds || [],
        totalPrice: calculatedTotal,
        status: 'Pending'
    });

    const savedOrder = await order.save();

    if (data.userId && data.productIds && data.productIds.length > 0) {
        RecommendationServer.save(data.userId, data.productIds).catch(() => {});
    }

    return savedOrder;
};

// retrieves a list of all orders belonging to a specific user
orderSchema.statics.findByUserId = async function(userId) {
    const orders = await this.find({ userId });
    const result = [];
    for (let o of orders) {
        result.push(await this._recalculatePrice(o));
    }
    return result;
};

// updates an existing order while preserving its original ID
// Explicitly build the updated order to prevent security hacks (like stealing ownership)
// Recalculate price securely if products changed
orderSchema.statics.updateOrder = async function(id, data) {
    const oldOrder = await this.findById(id);
    if (!oldOrder) return null;

    const oldProductIds = oldOrder.productIds || [];
    const newProductIds = data.productIds;

    if (newProductIds && Array.isArray(newProductIds)) {
        const allUserOrders = await this.findByUserId(oldOrder.userId);
        const otherOrdersProducts = new Set();
        allUserOrders.forEach(o => {
            if (o.id !== id && o.productIds) {
                o.productIds.forEach(pid => otherOrdersProducts.add(pid));
            }
        });

        const newProductIdsSet = new Set(newProductIds);
        const productsToDelete = oldProductIds.filter(pid => 
            !newProductIdsSet.has(pid) && !otherOrdersProducts.has(pid)
        );

        if (productsToDelete.length > 0) {
            RecommendationServer.delete(oldOrder.userId, productsToDelete).catch(() => {});
        }

        if (newProductIds.length > 0) {
            RecommendationServer.save(oldOrder.userId, newProductIds).catch(() => {});
        }
    }

    if (data.status) oldOrder.status = data.status;
    if (newProductIds && Array.isArray(newProductIds)) {
        oldOrder.productIds = newProductIds;
    }

    await this._recalculatePrice(oldOrder);
    return oldOrder.save();
};

// deletes an order by its ID
orderSchema.statics.deleteOrder = async function(id) {
    const order = await this.findById(id);
    if (!order) return false;

    if (order.productIds && order.productIds.length > 0) {
        const allUserOrders = await this.findByUserId(order.userId);
        const otherOrdersProducts = new Set();
        allUserOrders.forEach(o => {
            if (o.id !== id && o.productIds) {
                o.productIds.forEach(pid => otherOrdersProducts.add(pid));
            }
        });

        const productsToDelete = order.productIds.filter(pid => !otherOrdersProducts.has(pid));

        if (productsToDelete.length > 0) {
            RecommendationServer.delete(order.userId, productsToDelete).catch(() => {});
        }
    }

    await this.findByIdAndDelete(id);
    return true;
};


const OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;
