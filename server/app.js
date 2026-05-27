const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Both /api/users and /api/tokens will go to userRoutes.js
app.use('/api', userRoutes);
app.use('/api/resturants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);

app.listen(port);