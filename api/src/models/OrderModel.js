const db = require('./InMemoryDB');
const RecommendationServer = require('../services/recommendationServer');
const ProductModel = require('./ProductModel');

// generates a unique order ID based on timestamp and a random number
const generateOrderId = () => {
    return 'o_' + Date.now().toString() + '_' + Math.floor(Math.random() * 1000);
};

class OrderModel {
    // retrieves all orders from the database
    static getAll() {
        return db.orders;
    }

    // creates a new order with default values for missing fields
    static create(data) {
        let calculatedTotal = 0;
        if (data.productIds && Array.isArray(data.productIds)) {
            data.productIds.forEach(pid => {
                const product = ProductModel.findById(data.restaurantId, pid);
                if (product && product.price) {
                    calculatedTotal += product.price;
                }
            });
        }

        const newOrder = {
            id: generateOrderId(),
            userId: data.userId,
            restaurantId: data.restaurantId,
            productIds: data.productIds || [],
            totalPrice: calculatedTotal,
            status: 'Pending', 
            createdAt: new Date().toISOString()
        };
        db.orders.push(newOrder);

        if (data.userId && data.productIds && data.productIds.length > 0) {
            RecommendationServer.save(data.userId, data.productIds).catch(() => {});
        }

        return newOrder;
    }

    // finds and returns a specific order by its unique ID
    static findById(id) {
        return db.orders.find(o => o.id === id);
    }

    // retrieves a list of all orders belonging to a specific user
    static findByUserId(userId) {
        return db.orders.filter(order => order.userId === userId);
    }

    // updates an existing order while preserving its original ID
    static update(id, data) {
        const index = db.orders.findIndex(o => o.id === id);
        if (index === -1) return null;

        const oldOrder = db.orders[index];
        const oldProductIds = oldOrder.productIds || [];
        const newProductIds = data.productIds;

        if (newProductIds && Array.isArray(newProductIds)) {
            const allUserOrders = this.findByUserId(oldOrder.userId);
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

        const updatedOrder = {
            ...db.orders[index],
            ...data,
            id: id 
        };

        // Recalculate price securely if products changed
        if (data.productIds && Array.isArray(data.productIds)) {
            let calculatedTotal = 0;
            data.productIds.forEach(pid => {
                const product = ProductModel.findById(updatedOrder.restaurantId, pid);
                if (product && product.price) {
                    calculatedTotal += product.price;
                }
            });
            updatedOrder.totalPrice = calculatedTotal;
        } else if ('totalPrice' in data) {
            // Prevent users from manually overriding the price during updates
            updatedOrder.totalPrice = db.orders[index].totalPrice;
        }

        // Prevent users from manually overriding the status
        if ('status' in data) {
            updatedOrder.status = db.orders[index].status;
        }

        db.orders[index] = updatedOrder;
        return updatedOrder;
    }

    // deletes an order by its ID
    static delete(id) {
        const index = db.orders.findIndex(o => o.id === id);
        if (index === -1) return false;

        const order = db.orders[index];

        if (order.productIds && order.productIds.length > 0) {
            const allUserOrders = this.findByUserId(order.userId);
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

        db.orders.splice(index, 1);
        return true;
    }
}

module.exports = OrderModel;
