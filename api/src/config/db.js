const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tmt_db';
        await mongoose.connect(uri);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        // We do not exit the process here to avoid crashing the server loop
        // It will allow the server to return 500 errors to the client gracefully
    }
};

module.exports = connectDB;
