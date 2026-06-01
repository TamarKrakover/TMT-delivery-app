const express = require('express');
const app = express();
const port = 8080;

// Organize the print format
app.set('json spaces', 2);

// Allows the server to read JSON data
app.use(express.json());

// Import all routes
const userRoutes = require('./src/routes/userRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');

// Mount routes to their respective paths
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tokens', tokenRoutes);

app.listen(port);