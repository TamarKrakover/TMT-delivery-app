const db = require('./InMemoryDB');

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
        const newOrder = {
            id: generateOrderId(),
            userId: data.userId,
            restaurantId: data.restaurantId,
            productIds: data.productIds || [],
            totalPrice: data.totalPrice || 0,
            status: data.status || 'Pending', 
            createdAt: new Date().toISOString()
        };
        db.orders.push(newOrder);
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

        const updatedOrder = {
            ...db.orders[index],
            ...data,
            id: id 
        };

        db.orders[index] = updatedOrder;
        return updatedOrder;
    }

    // deletes an order by its ID
    static delete(id) {
        const index = db.orders.findIndex(o => o.id === id);
        if (index === -1) return false;

        db.orders.splice(index, 1);
        return true;
    }
}

module.exports = OrderModel;
