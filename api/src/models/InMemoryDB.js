const db = {
    users: [
        { id: "admin", username: "admin", password: "password", isAdmin: true },
        { id: "user1", username: "user1", password: "password", isAdmin: false }
    ],
    restaurants: [
        { id: "r1", name: "Burger Palace", description: "Best burgers in town", category: "Burgers", address: "123 Main St", creatorId: "admin", imageKey: "burger" },
        { id: "r2", name: "Pizza Di Mama", description: "Authentic Italian pizza", category: "Pizza", address: "456 Oak Ave", creatorId: "admin", imageKey: "pizza" },
        { id: "r3", name: "Sushi Zen", description: "Fresh and delicious sushi", category: "Sushi", address: "789 Pine Rd", creatorId: "admin", imageKey: "sushi" },
        { id: "r4", name: "Wok Star", description: "Amazing Asian fusion", category: "Asian", address: "101 Maple Blvd", creatorId: "admin", imageKey: "asian" },
        { id: "r5", name: "Sweet Dreams", description: "Decadent desserts", category: "Desserts", address: "202 Elm St", creatorId: "admin", imageKey: "dessert" },
        { id: "r6", name: "Green & Fresh", description: "Healthy salads", category: "Salads", address: "303 Cedar Ln", creatorId: "admin", imageKey: "salad" },
        { id: "r7", name: "MoriaHamburger", description: "Specialty burgers", category: "Burgers", address: "404 Birch Way", creatorId: "admin", imageKey: "burger" },
        { id: "r8", name: "Tamarmelada", description: "Sweet delights", category: "Desserts", address: "505 Spruce Dr", creatorId: "admin", imageKey: "dessert" },
        { id: "r9", name: "Tomeregez", description: "Premium grilled meats", category: "Grill", address: "606 Ash Ct", creatorId: "admin", imageKey: "burger" }
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
