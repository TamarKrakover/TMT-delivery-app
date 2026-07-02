const db = {
    users: [
        { id: "admin", name: "admin",username: "admin", password: "admin123!", isAdmin: true, location: { lat: 32.0853, lng: 34.7818 }},
        { id: "u_1781793101189_569", name: "User 1", username: "user1", password: "Password123!", role: "customer", location: { lat: 32.0853, lng: 34.7818 }},
        { id: "u_1781798384998_855", name: "User 2", username: "user2", password: "Password123!", role: "customer", location: { lat: 32.0853, lng: 34.7818 }}
    ],
    restaurants: [
        { id: "r1", name: "Burger Palace", description: "The ultimate destination for mouth-watering, flame-grilled burgers made with 100% premium beef and fresh ingredients.", category: "Burgers", creatorId: "admin", imageKey: "burger", image: "/api/uploads/restaurants/hamburger.webp", location: { lat: 32.0833, lng: 34.7850 } },
        { id: "r2", name: "Pizza Di Mama", description: "Experience a slice of Italy with our authentic, wood-fired Neapolitan pizzas crafted from generations-old family recipes.", category: "Pizza", creatorId: "admin", imageKey: "pizza", image: "/api/uploads/restaurants/pizza.webp", location: { lat: 32.0750, lng: 34.7700 } },
        { id: "r3", name: "Sushi Zen", description: "Immerse yourself in the art of Japanese cuisine with our exquisite, freshly prepared sushi and sashimi plates.", category: "Sushi", creatorId: "admin", imageKey: "sushi", image: "/api/uploads/restaurants/sushi.webp", location: { lat: 32.0900, lng: 34.7900 } },
        { id: "r4", name: "Wok Star", description: "A vibrant culinary journey through Asia, serving up aromatic stir-fries, rich curries, and comforting noodle dishes.", category: "Asian", creatorId: "admin", imageKey: "asian", image: "/api/uploads/restaurants/wok.webp", location: { lat: 32.0650, lng: 34.7650 } },
        { id: "r5", name: "Sweet Dreams", description: "Satisfy your cravings with our decadent selection of artisanal cakes, creamy gelatos, and heavenly pastries.", category: "Desserts", creatorId: "admin", imageKey: "dessert", image: "/api/uploads/restaurants/sweet-dreams.webp", location: { lat: 32.0880, lng: 34.7750 } },
        { id: "r6", name: "Green & Fresh", description: "Nourish your body with our vibrant, farm-to-table salads, hearty grain bowls, and refreshing cold-pressed juices.", category: "Salads", creatorId: "admin", imageKey: "salad", image: "/api/uploads/restaurants/salad.webp", location: { lat: 32.0700, lng: 34.7850 } },
        { id: "r7", name: "MoriHamburger", description: "Home of the colossal, towering burgers packed with flavor, melty cheeses, and our signature secret sauces.", category: "Burgers", creatorId: "admin", imageKey: "burger", image: "/api/uploads/restaurants/morihamburger.webp", location: { lat: 32.0950, lng: 34.7950 } },
        { id: "r8", name: "Tamarmelada", description: "A whimsical bakery and dessert parlor specializing in colorful fruit tarts, macarons, and custom confections.", category: "Desserts", creatorId: "admin", imageKey: "dessert", image: "/api/uploads/restaurants/tamarmelada.webp", location: { lat: 32.0810, lng: 34.7710 } },
        { id: "r9", name: "Tomeregez", description: "An upscale grill house offering prime cuts of steak, savory smoked meats, and a fiery dining experience.", category: "Grill", creatorId: "admin", imageKey: "burger", image: "/api/uploads/restaurants/tomergez.webp", location: { lat: 32.0860, lng: 34.7860 } }
    ],
    products: [
        // r1: Burger Palace
        { id: "123e4567-e89b-12d3-a456-426614174000", restaurantId: "r1", name: "Classic Beef Burger", description: "Juicy 6oz beef patty topped with crisp lettuce, ripe tomato, pickles, and our house sauce on a toasted brioche bun.", price: 10.99 , image: "/api/uploads/products/classic-beef-burger.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174002", restaurantId: "r1", name: "Spicy Crispy Chicken", description: "Golden fried chicken breast, jalapeños, and spicy mayo.", price: 11.99 , image: "/api/uploads/products/spicy-crispy-chicken.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174003", restaurantId: "r1", name: "Truffle Fries", description: "Crispy shoestring fries tossed in truffle oil.", price: 5.99 , image: "/api/uploads/products/truffle-fries.webp" },

        // r2: Pizza Di Mama
        { id: "123e4567-e89b-12d3-a456-426614174004", restaurantId: "r2", name: "Margherita Tradizionale", description: "San Marzano tomato sauce, fresh mozzarella di bufala, fresh basil, and extra virgin olive oil.", price: 14.99 , image: "/api/uploads/products/margherita-tradizionale.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174005", restaurantId: "r2", name: "Pizza Fungi", description: "Fresh wild mushrooms, mozzarella, tomato sauce, and a drizzle of truffle oil.", price: 16.99 , image: "/api/uploads/products/pizza-fungi.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174006", restaurantId: "r2", name: "Quattro Formaggi", description: "A rich blend of mozzarella, gorgonzola, parmesan, and ricotta cheeses on a garlic olive oil base.", price: 17.99 , image: "/api/uploads/products/quattro-formaggi.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174007", restaurantId: "r2", name: "Garlic Knots", description: "Warm, fluffy dough knots tossed in garlic butter, parsley, and parmesan.", price: 4.99 , image: "/api/uploads/products/garlic-knots.webp" },

        // r3: Sushi Zen
        { id: "123e4567-e89b-12d3-a456-426614174008", restaurantId: "r3", name: "Salmon Avocado Roll", description: "Fresh Atlantic salmon and creamy avocado wrapped in seasoned rice and nori.", price: 8.99 , image: "/api/uploads/products/salmon-avocado-rol.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174009", restaurantId: "r3", name: "Spicy Tuna Crunch Roll", description: "Spicy minced tuna, cucumber, topped with tempura flakes and spicy mayo.", price: 10.99 , image: "/api/uploads/products/spicy-tuna-crunch-roll.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174010", restaurantId: "r3", name: "Sweet Potato Tempura Roll", description: "Crispy sweet potato tempura inside, beautifully topped with layered avocado and teriyaki sauce.", price: 12.99 , image: "/api/uploads/products/sweet-potato-tempura-roll.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174011", restaurantId: "r3", name: "Zen Sashimi Platter", description: "Chef's selection of 12 premium slices of fresh seasonal fish.", price: 28.99 , image: "/api/uploads/products/zen-sashimi-platter.webp" },

        // r4: Wok Star
        { id: "123e4567-e89b-12d3-a456-426614174012", restaurantId: "r4", name: "Pad Thai Noodles", description: "Classic Thai rice noodles stir-fried with egg, peanuts, bean sprouts, and tamarind sauce.", price: 13.99 , image: "/api/uploads/products/pad-thai-noodles.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174013", restaurantId: "r4", name: "General Tso's Chicken", description: "Crispy chicken chunks tossed in a sweet and spicy soy-ginger sauce with steamed broccoli.", price: 15.99 , image: "/api/uploads/products/general-tsos-chicken.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174014", restaurantId: "r4", name: "Vegetable Spring Rolls", description: "Crispy fried wrappers filled with shredded cabbage, carrots, and glass noodles.", price: 5.99 , image: "/api/uploads/products/vegetable-spring-rolls.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174015", restaurantId: "r4", name: "Green Curry", description: "Aromatic Thai green curry with coconut milk, bamboo shoots, basil, and choice of protein.", price: 16.99 , image: "/api/uploads/products/green-curry.webp" },

        // r5: Sweet Dreams
        { id: "123e4567-e89b-12d3-a456-426614174016", restaurantId: "r5", name: "New York Cheesecake", description: "Rich, dense, and smooth cheesecake with a graham cracker crust and strawberry compote.", price: 7.99 , image: "/api/uploads/products/new-york-cheesecake.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174017", restaurantId: "r5", name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey, molten chocolate center served with vanilla bean ice cream.", price: 9.99 , image: "/api/uploads/products/chocolate-lava-cake.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174018", restaurantId: "r5", name: "Tiramisu", description: "Classic Italian dessert made of ladyfingers dipped in espresso, layered with a whipped mascarpone mixture.", price: 8.99 , image: "/api/uploads/products/tiramisu.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174019", restaurantId: "r5", name: "Artisanal Gelato Scoop", description: "Choose from our daily selection of freshly churned authentic Italian gelatos.", price: 4.99 , image: "/api/uploads/products/artisanal-gelato-scoop.webp" },

        // r6: Green & Fresh
        { id: "123e4567-e89b-12d3-a456-426614174020", restaurantId: "r6", name: "Quinoa Power Bowl", description: "Organic quinoa, roasted sweet potatoes, avocado, kale, and toasted pumpkin seeds with lemon tahini dressing.", price: 14.99 , image: "/api/uploads/products/quinoa-power-bowl.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174021", restaurantId: "r6", name: "Classic Caesar Salad", description: "Crisp romaine hearts, shaved parmesan, garlic croutons, and house-made creamy Caesar dressing.", price: 11.99 , image: "/api/uploads/products/classic-caesar-salad.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174022", restaurantId: "r6", name: "Mediterranean Medley", description: "Mixed greens, cucumbers, cherry tomatoes, Kalamata olives, feta cheese, and red onions with Greek vinaigrette.", price: 13.99 , image: "/api/uploads/products/mediterranean-medley.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174023", restaurantId: "r6", name: "Green Detox Smoothie", description: "Refreshing blend of spinach, apple, celery, cucumber, ginger, and lemon.", price: 6.99 , image: "/api/uploads/products/green-detox-smoothie.webp" },

        // r7: MoriaHamburger
        { id: "123e4567-e89b-12d3-a456-426614174024", restaurantId: "r7", name: "Moria Monster Tower", description: "A towering triple beef patty burger with a fried egg, crispy onion rings, and our signature Moria sauce.", price: 19.99 , image: "/api/uploads/products/moria-monster-tower.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174025", restaurantId: "r7", name: "Smashburger Special", description: "Two thin, crispy-edged beef patties smashed on the grill, layered with caramelized onions and pickles.", price: 12.99 , image: "/api/uploads/products/smashburger-special.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174026", restaurantId: "r7", name: "Loaded Crispy Fries", description: "Crinkle-cut fries smothered in spicy mayo, jalapeños, and crispy fried onions.", price: 7.99 , image: "/api/uploads/products/loaded-crispy-fries.webp" },

        // r8: Tamarmelada
        { id: "123e4567-e89b-12d3-a456-426614174027", restaurantId: "r8", name: "Tamar's Signature Fruit Tart", description: "A buttery, crisp pastry shell filled with vanilla custard and topped with a beautiful array of fresh seasonal fruits.", price: 8.99 , image: "/api/uploads/products/tamars-signature-fruit-tart.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174028", restaurantId: "r8", name: "Assorted Macarons Box", description: "A delicate and colorful assortment of 6 French macarons in varying flavors like pistachio, raspberry, and vanilla.", price: 12.99 , image: "/api/uploads/products/assorted-macarons-box.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174029", restaurantId: "r8", name: "Lemon Meringue Pie", description: "Zesty, tangy lemon curd topped with a mountain of fluffy, lightly toasted meringue.", price: 7.99 , image: "/api/uploads/products/lemon-meringue-pie.webp" },

        // r9: Tomeregez
        { id: "123e4567-e89b-12d3-a456-426614174030", restaurantId: "r9", name: "Prime Tomahawk Ribeye", description: "A colossal 32oz bone-in ribeye steak, dry-aged for 28 days and grilled to absolute perfection. Perfect for sharing.", price: 89.99 , image: "/api/uploads/products/prime-tomahawk-ribeye.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174031", restaurantId: "r9", name: "Smoked BBQ Brisket", description: "Slow-smoked beef brisket, extremely tender and served with our tangy house BBQ sauce.", price: 24.99 , image: "/api/uploads/products/smoked-bbq-brisket.webp" },
        { id: "123e4567-e89b-12d3-a456-426614174032", restaurantId: "r9", name: "Grilled Asparagus & Garlic Mash", description: "Char-grilled asparagus spears alongside roasted garlic mashed potatoes with olive oil.", price: 9.99 , image: "/api/uploads/products/grilled-asparagus-and-garlic-mash.webp" }
    ],
    orders: [],
    categories: [
        { name: 'Burgers', image: "/api/uploads/categories/burgers.webp" },
        { name: 'Pizza', image: "/api/uploads/categories/pizza.webp" },
        { name: 'Asian', image: "/api/uploads/categories/asian.webp" },
        { name: 'Desserts', image: "/api/uploads/categories/dessert.webp" },
        { name: 'Sushi', image: "/api/uploads/categories/sushi.webp" },
        { name: 'Salads', image: "/api/uploads/categories/salad.webp" },
        { name: 'Grill', image: "/api/uploads/categories/grill.webp" },
        { name: 'General', image: "/api/uploads/categories/all.webp" }
    ]
};

// Export the db object to be required by any controller that needs data access
module.exports = db;
