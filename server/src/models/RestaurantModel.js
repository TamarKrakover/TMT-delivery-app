
const db = require('./inMemoryDB');

const generateRestId = () => {
    return 'r_' + Date.now().toString() + '_' + Math.floor(Math.random() * 1000);
};

class RestaurantModel {
    static getAll() {
        return db.restaurants;
    }
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
        
        if (index === -1) return false;

        // Remove from array
        db.restaurants.splice(index, 1);
        return true;
    }
}

module.exports = RestaurantModel;