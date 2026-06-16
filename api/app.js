const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Organize the print format
app.set('json spaces', 2);

// Allows the server to read JSON data (increased limit for base64 images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static images from public/images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Import all routes
const userRoutes = require('./src/routes/userRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

// Mount routes to their respective paths
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/categories', categoryRoutes);

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