const db = require('./InMemoryDB');

class CategoryModel {
    // Retrieve all categories, computing the restaurant count for each
    static getAll() {
        return db.categories.map(cat => {
            const count = db.restaurants.filter(r => r.category.toLowerCase() === cat.name.toLowerCase()).length;
            return {
                ...cat,
                count
            };
        });
    }

    // Create a new category
    static create(data) {
        // Enforce uniqueness of name (case-insensitive)
        const isDuplicate = db.categories.some(c => c.name.toLowerCase() === data.name.toLowerCase());
        if (isDuplicate) {
            throw new Error('DUPLICATE_CATEGORY');
        }

        const newCategory = {
            name: data.name,
            image: data.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80"
        };
        db.categories.push(newCategory);
        return { ...newCategory, count: 0 };
    }
}

module.exports = CategoryModel;
