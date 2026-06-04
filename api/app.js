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

// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(port);