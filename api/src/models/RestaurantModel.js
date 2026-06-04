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

        // Merge existing data with new data, protecting the original ID
        const updatedRestaurant = {
            ...db.restaurants[index],
            ...data,
            id: id 
        };

        db.restaurants[index] = updatedRestaurant;
        return updatedRestaurant;
    }

    // Delete a restaurant
    static delete(id) {
        const index = db.restaurants.findIndex(r => r.id === id);
        
        // Return false if the restaurant doesn't exist
        if (index === -1) return false;

        // Remove from array
        db.restaurants.splice(index, 1);
        return true;
    }
}

module.exports = RestaurantModel;