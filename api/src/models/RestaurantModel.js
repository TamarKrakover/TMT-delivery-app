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

    // Create a new restaurant with creatorId constraint
    static create(data, creatorId) {
        // Enforce uniqueness of name
        const isDuplicate = db.restaurants.some(r => r.name === data.name);
        if (isDuplicate) {
            throw new Error('DUPLICATE_RESTAURANT');
        }

        const newRestaurant = {
            id: generateRestId(),
            name: data.name,
            description: data.description || '',
            category: data.category || 'General',
            imageKey: data.imageKey || (data.category ? data.category.toLowerCase() : 'general'),
            location: data.location,
            creatorId: creatorId
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

        // Check for duplicates if name is being updated
        if (data.name !== undefined) {
            const isDuplicate = db.restaurants.some(r => r.id !== id && r.name === newName);
            if (isDuplicate) {
                throw new Error('DUPLICATE_RESTAURANT');
            }
        }

        // Merge existing data with new data, protecting the original ID
        const updatedRestaurant = {
            ...currentRest,
            ...data,
            location: data.location !== undefined ? data.location : currentRest.location,
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