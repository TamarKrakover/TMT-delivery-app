const db = require('./InMemoryDB');

// Generate a unique restaurant ID based on timestamp and a random number
const generateRestId = () => {
    return 'r_' + Date.now().toString() + '_' + Math.floor(Math.random() * 1000);
};

class RestaurantModel {
    // Retrieve all restaurants from the database
    static getAll() {
        return db.restaurants;
    }

    // Create a new restaurant with default fallback values
    static create(data) {
        // Enforce uniqueness of name + address
        const isDuplicate = db.restaurants.some(r => r.name === data.name && r.address === data.address);
        if (isDuplicate) {
            throw new Error('DUPLICATE_RESTAURANT');
        }

        const newRestaurant = {
            id: generateRestId(),
            name: data.name,
            description: data.description || '',
            category: data.category || 'General',
            address: data.address
        };
        db.restaurants.push(newRestaurant);
        return newRestaurant;
    }

    // Retrieve a specific restaurant by its unique ID
    static findById(id) {
        return db.restaurants.find(r => r.id === id);
    }

    // Update an existing restaurant
    static update(id, data) {
        const index = db.restaurants.findIndex(r => r.id === id);
        
        // Return null if restaurant doesn't exist
        if (index === -1) return null;

        const currentRest = db.restaurants[index];
        const newName = data.name !== undefined ? data.name : currentRest.name;
        const newAddress = data.address !== undefined ? data.address : currentRest.address;

        // Check for duplicates if name or address are being updated
        if (data.name !== undefined || data.address !== undefined) {
            const isDuplicate = db.restaurants.some(r => r.id !== id && r.name === newName && r.address === newAddress);
            if (isDuplicate) {
                throw new Error('DUPLICATE_RESTAURANT');
            }
        }

        // Merge existing data with new data, protecting the original ID
        const updatedRestaurant = {
            ...currentRest,
            ...data,
            id: id 
        };

        db.restaurants[index] = updatedRestaurant;
        return updatedRestaurant;
    }

    // Delete a restaurant and all its associated products
    static delete(id) {
        const index = db.restaurants.findIndex(r => r.id === id);
        
        // Return false if the restaurant doesn't exist
        if (index === -1) return false;

        // Remove from array
        db.restaurants.splice(index, 1);

        // Remove all products associated with this restaurant to prevent memory leaks (zombie products)
        for (let i = db.products.length - 1; i >= 0; i--) {
            if (db.products[i].restaurantId === id) {
                db.products.splice(i, 1);
            }
        }

        return true;
    }
}

module.exports = RestaurantModel;