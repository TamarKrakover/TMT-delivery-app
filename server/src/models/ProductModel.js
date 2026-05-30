const db = require('./InMemoryDB');

// generates a unique product ID based on timestamp and a random number
const generateProductId = () => {
    return 'p_' + Date.now().toString() + '_' + Math.floor(Math.random() * 1000);
};

class ProductModel {
    // retrieves all products associated with a specific restaurant ID
    static getAllByRestaurant(restaurantId) {
        return db.products.filter(p => p.restaurantId === restaurantId);
    }

    // creates a new product, assigns a unique ID, and stores it in the database
    static create(restaurantId, data) {
        const newProduct = {
            id: generateProductId(),
            restaurantId: restaurantId,
            name: data.name,
            description: data.description || '',
            price: data.price
        };
        db.products.push(newProduct);
        return newProduct;
    }

    // finds and returns a specific product by its ID and restaurant ID
    static findById(restaurantId, productId) {
        return db.products.find(p => p.restaurantId === restaurantId && p.id === productId);
    }

    // updates an existing product's fields while protecting its original IDs
    static update(restaurantId, productId, data) {
        const index = db.products.findIndex(p => p.restaurantId === restaurantId && p.id === productId);
        
        if (index === -1) return null;

        // merge old data with new data using the spread operator
        const updatedProduct = {
            ...db.products[index],
            ...data,
            id: productId, 
            restaurantId: restaurantId 
        };

        db.products[index] = updatedProduct;
        return updatedProduct;
    }

    // removes a product from the database array
    static delete(restaurantId, productId) {
        const index = db.products.findIndex(p => p.restaurantId === restaurantId && p.id === productId);
        
        if (index === -1) return false;

        db.products.splice(index, 1);
        return true;
    }
}

module.exports = ProductModel;
