const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

const userRoutes = require('./src/routes/userRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const searchRoutes = require('./src/routes/searchRoutes');

// Both /api/users and /api/tokens will go to userRoutes.js
app.use('/api', userRoutes);
app.use('/api/resturants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);

app.listen(port);