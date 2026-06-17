const db = {
    users: [
        { id: "admin", name: "admin",username: "admin", password: "admin123!", isAdmin: true, location: { lat: 32.0853, lng: 34.7818 }}
    ],
    restaurants: [
        { id: "r1", name: "Burger Palace", description: "Best burgers in town", category: "Burgers", creatorId: "admin", imageKey: "burger", location: { lat: 32.0833, lng: 34.7850 } },
        { id: "r2", name: "Pizza Di Mama", description: "Authentic Italian pizza", category: "Pizza", creatorId: "admin", imageKey: "pizza", location: { lat: 32.0750, lng: 34.7700 } },
        { id: "r3", name: "Sushi Zen", description: "Fresh and delicious sushi", category: "Sushi", creatorId: "admin", imageKey: "sushi", location: { lat: 32.0900, lng: 34.7900 } },
        { id: "r4", name: "Wok Star", description: "Amazing Asian fusion", category: "Asian", creatorId: "admin", imageKey: "asian", location: { lat: 32.0650, lng: 34.7650 } },
        { id: "r5", name: "Sweet Dreams", description: "Decadent desserts", category: "Desserts", creatorId: "admin", imageKey: "dessert", location: { lat: 32.0880, lng: 34.7750 } },
        { id: "r6", name: "Green & Fresh", description: "Healthy salads", category: "Salads", creatorId: "admin", imageKey: "salad", location: { lat: 32.0700, lng: 34.7850 } },
        { id: "r7", name: "MoriaHamburger", description: "Specialty burgers", category: "Burgers", creatorId: "admin", imageKey: "burger", location: { lat: 32.0950, lng: 34.7950 } },
        { id: "r8", name: "Tamarmelada", description: "Sweet delights", category: "Desserts", creatorId: "admin", imageKey: "dessert", location: { lat: 32.0810, lng: 34.7710 } },
        { id: "r9", name: "Tomeregez", description: "Premium grilled meats", category: "Grill", creatorId: "admin", imageKey: "burger", location: { lat: 32.0860, lng: 34.7860 } }
    ],
    products: [
        { id: "123e4567-e89b-12d3-a456-426614174000", restaurantId: "r1", name: "Classic Burger", description: "Beef patty with lettuce and tomato", price: 8.99, imageKey: "burger" },
        { id: "123e4567-e89b-12d3-a456-426614174001", restaurantId: "r1", name: "Cheese Burger", description: "Beef patty with cheese", price: 9.99, imageKey: "burger" },
        { id: "123e4567-e89b-12d3-a456-426614174002", restaurantId: "r7", name: "Moria Special", description: "Double beef patty with secret sauce", price: 12.99, imageKey: "burger" },
        { id: "123e4567-e89b-12d3-a456-426614174003", restaurantId: "r8", name: "Tamar Tart", description: "Delicious fruit tart", price: 5.99, imageKey: "dessert" },
        { id: "123e4567-e89b-12d3-a456-426614174004", restaurantId: "r9", name: "Grilled Ribeye", description: "12oz Ribeye steak", price: 24.99, imageKey: "burger" }
    ],
    orders: [],
    categories: [
        { name: 'Burgers', image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80" },
        { name: 'Pizza', image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80" },
        { name: 'Asian', image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=150&auto=format&fit=crop&q=80" },
        { name: 'Desserts', image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&auto=format&fit=crop&q=80" },
        { name: 'Sushi', image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&auto=format&fit=crop&q=80" },
        { name: 'Salads', image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop&q=80" },
        { name: 'General', image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80" }
    ]
};

// Export the db object to be required by any controller that needs data access
module.exports = db;
