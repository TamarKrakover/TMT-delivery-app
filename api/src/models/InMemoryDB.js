const db = {
    users: [
        { id: "admin", username: "admin", password: "password", isAdmin: true, location: { lat: 32.0853, lng: 34.7818 } },
        { id: "user1", username: "user1", password: "password", isAdmin: false, location: { lat: 32.0800, lng: 34.7800 } }
    ],
    restaurants: [
        { id: "r1", name: "Burger Palace", description: "Best burgers in town", category: "Burgers", address: "123 Main St", creatorId: "admin", image: "/images/restaurants/hamburger.webp", location: { lat: 32.0833, lng: 34.7850 } },
        { id: "r2", name: "Pizza Di Mama", description: "Authentic Italian pizza", category: "Pizza", address: "456 Oak Ave", creatorId: "admin", image: "/images/restaurants/pizza.webp", location: { lat: 32.0750, lng: 34.7700 } },
        { id: "r3", name: "Sushi Zen", description: "Fresh and delicious sushi", category: "Sushi", address: "789 Pine Rd", creatorId: "admin", image: "/images/restaurants/sushi.webp", location: { lat: 32.0900, lng: 34.7900 } },
        { id: "r4", name: "Wok Star", description: "Amazing Asian fusion", category: "Asian", address: "101 Maple Blvd", creatorId: "admin", image: "/images/restaurants/wok.webp", location: { lat: 32.0650, lng: 34.7650 } },
        { id: "r5", name: "Sweet Dreams", description: "Decadent desserts", category: "Desserts", address: "202 Elm St", creatorId: "admin", image: "/images/restaurants/sweet-dreams.webp", location: { lat: 32.0880, lng: 34.7750 } },
        { id: "r6", name: "Green & Fresh", description: "Healthy salads", category: "Salads", address: "303 Cedar Ln", creatorId: "admin", image: "/images/restaurants/salad.webp", location: { lat: 32.0700, lng: 34.7850 } },
        { id: "r7", name: "MoriaHamburger", description: "Specialty burgers", category: "Burgers", address: "404 Birch Way", creatorId: "admin", image: "/images/restaurants/hamburger.webp", location: { lat: 32.0950, lng: 34.7950 } },
        { id: "r8", name: "Tamarmelada", description: "Sweet delights", category: "Desserts", address: "505 Spruce Dr", creatorId: "admin", image: "/images/restaurants/sweet-dreams.webp", location: { lat: 32.0810, lng: 34.7710 } },
        { id: "r9", name: "Tomeregez", description: "Premium grilled meats", category: "Grill", address: "606 Ash Ct", creatorId: "admin", image: "/images/restaurants/hamburger.webp", location: { lat: 32.0860, lng: 34.7860 } }
    ],
    products: [
        { id: "p1", restaurantId: "r1", name: "Classic Burger", description: "Beef patty with lettuce and tomato", price: 8.99 },
        { id: "p2", restaurantId: "r1", name: "Cheese Burger", description: "Beef patty with cheese", price: 9.99 },
        { id: "p3", restaurantId: "r7", name: "Moria Special", description: "Double beef patty with secret sauce", price: 12.99 },
        { id: "p4", restaurantId: "r8", name: "Tamar Tart", description: "Delicious fruit tart", price: 5.99 },
        { id: "p5", restaurantId: "r9", name: "Grilled Ribeye", description: "12oz Ribeye steak", price: 24.99 }
    ],
    orders: []
};

// Export the db object to be required by any controller that needs data access
module.exports = db;
