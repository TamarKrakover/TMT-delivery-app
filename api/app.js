const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
const port = 8080;

app.use(cors());

// Connect to MongoDB
connectDB().then(async () => {
    // Auto-seed data safely (it will only add missing items and won't overwrite)
    try {
        console.log('Ensuring all initial data exists (Auto-seed)...');
        const seedData = require('./src/config/seed');
        await seedData();
    } catch (e) {
        console.error('Failed to auto-seed database:', e);
    }
});
// Organize the print format
app.set('json spaces', 2);

// Allows the server to read JSON data (increased limit for base64 images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const path = require('path');
app.use('/api/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Import all routes
const userRoutes = require('./src/routes/userRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const recommendationRoutes = require('./src/routes/recommendationRoutes');

// Mount routes to their respective paths
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/recommendations', recommendationRoutes);

const ProductModel = require('./src/models/ProductModel');
app.get('/api/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await ProductModel.findByGlobalId(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product by global ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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