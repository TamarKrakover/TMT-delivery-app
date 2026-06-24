const mongoose = require('mongoose');

const connectDB = () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tmt_db';
    
    return new Promise((resolve) => {
        const connectWithRetry = async () => {
            try {
                await mongoose.connect(uri);
                console.log('Successfully connected to MongoDB');
                resolve();
            } catch (error) {
                console.error('MongoDB not ready yet. Retrying in 2 seconds...', error.message);
                setTimeout(connectWithRetry, 2000);
            }
        };
        connectWithRetry();
    });
};

module.exports = connectDB;
